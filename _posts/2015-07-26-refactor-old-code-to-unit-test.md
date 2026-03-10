---
layout: "post"
title: "Refactor Old Code to Unit Test"
date: 2015-07-26 07:43:10 -0400
description: "Even old code can be unit tested"
summary: "Even old code can be unit tested"
subtitle: "Even old code can be unit tested"
tags:
  - testing
---
I originally wrote this article on 4/10/10 which is now over five years ago!  I am posting it in its original form to get it online.

Begin time warp...

###How to refactor your code to aid in unit testing
One of the biggest problems that occur with legacy code is the problem of testability.  Many times developers are afraid to make the simplest changes to an existing project since they are unfamiliar with the code base and they don’t want to introduce any unforeseen problems.  In my past life we used to use win forms for our testing or even a console application (even if we ever used them we usually built and pushed out to development/staging/or even production and clicked a few buttons on the web form and crossed our fingers).  One way to help alleviate this pain is to introduce some unit tests into the system before you do any potentially breaking changes.  By doing this you setup a base line for a particular method or class.  If your changes cause one of these base line tests to fail you know you need to rework your change so the whole system functions properly.  This practice will reassure you that your changes will not have unintended effects on the system plus you will take pride in the fact you left the code base off better than it did when you started.

Our Example Our example will deal with a simple video store processor.   We have three simple poco models, Movie, Customer, and Customer Profile.

```csharp
public class Movie {
	public int Id {get;set;}
	public string Title {get;set;}
	public string Rating {get;set;}
}

public class Customer {
	public int Id {get;set;}
	public string FirstName {get;set;}
	public string LastName {get;set;}
	public string EmailAddress {get;set;}
}

public class CustomerProfile {
	public int Id {get;set;}
	public int CustomerId {get;set;}
	public bool EmailNotifacation {get;set;}
}

```

Our processor has one simple method on it named RentMovie(Customer, Movie). 

```csharp
public class VideoStoreProcessor {
	public void RentMovie(Customer customer, Movie movie) {
		Database database = DatabaseFactory.CreateDatabase();

		DbCommand outstandingRentalsCommand = database.GetStoredProcCommand("CheckForOutstandingRentals");
		database.AddInParameter(outstandingRentalsCommand, "@CustomerId", DbType.Int32);

		//Check if the customer has an rental spot open.
		bool canRentMovie = Convert.ToBoolean(database.ExecuteScalar(outstandingRentalsCommand));

		if (canRentMovie) {
			//Rent the movie and mark it for shipment
			DbCommand command = database.GetStoredProcCommand("RentMovieToCustomer");
			database.AddInParameter(command, "@CustomerId", DbType.Int32, customer.Id);
			database.AddInParameter(command, "@MovieId", DbType.Int32, movie.Id);
			database.ExecuteNonQuery(command);

			CustomerProfile customerProfile = null;
			DbCommand profileCommand = database.GetStoredProcCommand("GetCustomerProfile");
			database.AddInParameter(profileCommand, "@CustomerId", DbType.Int32, customer.Id);
			using(IDataReader reader = database.ExecuteReader(profileCommand)) {
				if (reader.Read()) {
					customerProfile = new CustomerProfile();
					customerProfile.CustomerId = customer.Id;
					customerProfile.Id = Convert.ToInt32(reader["Id"]);
					customerProfile.EmailNotifacation = Convert.ToBoolean(reader["EmailNotification"]);
				}
			}
			if (customerProfile != null) {
				if (customerProfile.EmailNotifacation) {
					var mailMessage = new MailMessage("yourgettingamovie@markflix.com", customer.EmailAddress);
					mailMessage.Subject = "You are getting a movie!";
					mailMessage.Body = string.Format("You are going to get {0} in 1-2 days", movie.Title);

					using(var smtpClient = new SmtpClient("localhost")) {
						smtpClient.Send(mailMessage);
					}
				}
			}
		} else {
			//Add the movie to thier queue
			DbCommand command = database.GetStoredProcCommand("AddMovieToCustomersQueue");
			database.AddInParameter(command, "@CustomerId", DbType.Int32, customer.Id);
			database.AddInParameter(command, "@MovieId", DbType.Int32, movie.Id);
			database.ExecuteNonQuery(command);
		}

		XDocument document = XDocument.Load("MovieReport.xml");
		if (document.Root != null) {
			document.Root.Add(new XElement("Movie", new XAttribute("id", movie.Id),
			new XAttribute("title", movie.Title),
			new XAttribute("rentedBy", customer.Id)));
			document.Save("MovieReport.xml");
		}
	}
}
```

From this you can see things are not very nice, the method is very long and appears to that it might need a bit of clean up at least.  First things first, let’s refactor with ReSharper to extract some methods to make our intent a bit clearer.
After our first round of refactoring

```csharp
public class VideoStoreProcessor
{
	public void RentMovie(Customer customer, Movie movie)
	{
		bool canCustomerRentAMovie = CanCustomerRentAMovie(customer.Id);
		if (canCustomerRentAMovie)
		{
			//Rent the movie and mark it for shipment
			RentMovieToCustomer(customer.Id, movie.Id);
			CustomerProfile customerProfile = GetCustomerProfile(customer.Id);
			if (customerProfile != null)
			{
				if (customerProfile.EmailNotifacation)
				{
					SendNotification(customer, movie);
				}
			}
		}
		else
		{
			//Add the movie to thier queue
			AddMovieToCustomersQueue(customer.Id, movie.Id);
		}

		AddMovieToReport(customer, movie);
	}

	private void AddMovieToReport(Customer customer, Movie movie)
	{
		XDocument document = XDocument.Load("MovieReport.xml");
		if (document.Root != null)
		{
			document.Root.Add(new XElement("Movie", new XAttribute("id", movie.Id), new XAttribute("title", movie.Title), new XAttribute("rentedBy", customer.Id)));
			document.Save("MovieReport.xml");
		}
	}

	private void AddMovieToCustomersQueue(int customerId, int movieId)
	{
		Database database = DatabaseFactory.CreateDatabase();
		DbCommand command = database.GetStoredProcCommand("AddMovieToCustomersQueue");
		database.AddInParameter(command, "@CustomerId", DbType.Int32, customerId);
		database.AddInParameter(command, "@MovieId", DbType.Int32, movieId);
		database.ExecuteNonQuery(command);
	}

	private void SendNotification(Customer customer, Movie movie)
	{
		var mailMessage = new MailMessage("yourgettingamovie@markflix.com", customer.EmailAddress);
		mailMessage.Subject = "You are getting a movie!";
		mailMessage.Body = string.Format("You are going to get {0} in 1-2 days", movie.Title);
		using (var smtpClient = new SmtpClient("localhost"))
		{
			smtpClient.Send(mailMessage);
		}
	}

	private CustomerProfile GetCustomerProfile(int customerId)
	{
		Database database = DatabaseFactory.CreateDatabase();
		CustomerProfile customerProfile = null;
		DbCommand profileCommand = database.GetStoredProcCommand("GetCustomerProfile");
		database.AddInParameter(profileCommand, "@CustomerId", DbType.Int32, customerId);
		using (IDataReader reader = database.ExecuteReader(profileCommand))
		{
			if (reader.Read())
			{
				customerProfile = new CustomerProfile();
				customerProfile.CustomerId = customerId;
				customerProfile.Id = Convert.ToInt32(reader["Id"]);
				customerProfile.EmailNotifacation = Convert.ToBoolean(reader["EmailNotification"]);
			}
		}

		return customerProfile;
	}

	private void RentMovieToCustomer(int customerId, int movieId)
	{
		Database database = DatabaseFactory.CreateDatabase();
		DbCommand command = database.GetStoredProcCommand("RentMovieToCustomer");
		database.AddInParameter(command, "@CustomerId", DbType.Int32, customerId);
		database.AddInParameter(command, "@MovieId", DbType.Int32, movieId);
		database.ExecuteNonQuery(command);
	}

	private bool CanCustomerRentAMovie(int customerId)
	{
		Database database = DatabaseFactory.CreateDatabase();
		DbCommand outstandingRentalsCommand = database.GetStoredProcCommand("CheckForOutstandingRentals");
		database.AddInParameter(outstandingRentalsCommand, "@CustomerId", DbType.Int32, customerId);
		//Check if the customer has an rental spot open.
		return Convert.ToBoolean(database.ExecuteScalar(outstandingRentalsCommand));
	}
}
```

There that looks a bit better, we reduced the noise from the main method and we can follow the flow of the RentMovie method a bit clearer.  Looking over this we see that we have some dependencies we need to worry about if we want to truly do some unit testing on this method.  From here it looks like we have a dependency on a database to execute some stored procedures, a notification service that sends emails, and some sort of report that appends information to an xml file.  All of these external dependencies are road blocks for our goal of unit testing this method.  To accomplish this we are going to extract some interfaces.

###Extracting our dependencies
####```IVideoProcessorDataAccess```
From this we appear to need to extract three interfaces for our dependencies.  For our database calls we have for calls.  ```CanCustomerRentAMovie```, ```RentMovieToCustomer```, ```GetCustomerProfile```, and ```AddMovieToCustomersQueue```.  From this lets create an interface named ```IVideoProcessorDataAccess```

```csharp
public interface IVideoProcessorDataAccess
{
	bool CanCustomerRentAMovie(int customerId);
	void RentMovieToCustomer(int customerId, int movieId);
	void AddMovieToCustomersQueue(int customerId, int movieId);
	CustomerProfile GetCustomerProfile(int customerId);
}
```

 Our next step would be to derive a type from ```IVideoProcessorDataAccess``` called ```SqlVideoStoreDataAccess```

```csharp
public class SqlVideoProcessorDataAccess : IVideoProcessorDataAccess
{
	public bool CanCustomerRentAMovie(int customerId)
	{
		throw new NotImplementedException();
	}

	public void RentMovieToCustomer(int customerId, int movieId)
	{
		throw new NotImplementedException();
	}

	public void AddMovieToCustomersQueue(int customerId, int movieId)
	{
		throw new NotImplementedException();
	}

	public CustomerProfile GetCustomerProfile(int customerId)
	{
		throw new NotImplementedException();
	}
}
```
 
 Since we named everything the same as we did in our initial refactoring lets go ahead and copy the method body implementation inside of this newly created class.

```csharp
public class SqlVideoProcessorDataAccess : IVideoProcessorDataAccess
{
	private readonly Database _database;
	public SqlVideoProcessorDataAccess()
	{
		_database = DatabaseFactory.CreateDatabase();
	}

	public bool CanCustomerRentAMovie(int customerId)
	{
		DbCommand outstandingRentalsCommand = _database.GetStoredProcCommand("CheckForOutstandingRentals");
		_database.AddInParameter(outstandingRentalsCommand, "@CustomerId", DbType.Int32, customerId);
		//Check if the customer has an rental spot open.
		return Convert.ToBoolean(_database.ExecuteScalar(outstandingRentalsCommand));
	}

	public void RentMovieToCustomer(int customerId, int movieId)
	{
		DbCommand command = _database.GetStoredProcCommand("RentMovieToCustomer");
		_database.AddInParameter(command, "@CustomerId", DbType.Int32, customerId);
		_database.AddInParameter(command, "@MovieId", DbType.Int32, movieId);
		_database.ExecuteNonQuery(command);
	}

	public void AddMovieToCustomersQueue(int customerId, int movieId)
	{
		DbCommand command = _database.GetStoredProcCommand("AddMovieToCustomersQueue");
		_database.AddInParameter(command, "@CustomerId", DbType.Int32, customerId);
		_database.AddInParameter(command, "@MovieId", DbType.Int32, movieId);
		_database.ExecuteNonQuery(command);
	}

	public CustomerProfile GetCustomerProfile(int customerId)
	{
		CustomerProfile customerProfile = null;
		DbCommand profileCommand = _database.GetStoredProcCommand("GetCustomerProfile");
		_database.AddInParameter(profileCommand, "@CustomerId", DbType.Int32, customerId);
		using (IDataReader reader = _database.ExecuteReader(profileCommand))
		{
			if (reader.Read())
			{
				customerProfile = new CustomerProfile
				{
				CustomerId = customerId, Id = Convert.ToInt32(reader["Id"]), EmailNotifacation = Convert.ToBoolean(reader["EmailNotification"])}

				;
			}
		}

		return customerProfile;
	}
}
```

####```IVideoStoreNotifications```
Our next dependency is our email notification system we have for our video store processor.  We will go through our next step and create an interface for our video store notifications.

```csharp
public interface IVideoStoreNotifications
{
	void SendNotification(Customer customer, Movie movie);
}
```

And next derive a type that handles our notifications.
This will end up looking like the following:
SmtpVideoStoreNotifications

```csharp
public class SmtpVideoStoreNotifications : IVideoStoreNotifications
{
	public void SendNotification(Customer customer, Movie movie)
	{
		var mailMessage = new MailMessage("yourgettingamovie@markflix.com", customer.EmailAddress)
		{
		Subject = "You are getting a movie!", Body = string.Format("You are going to get {0} in 1-2 days", movie.Title)}

		;
		using (var smtpClient = new SmtpClient("localhost"))
		{
			smtpClient.Send(mailMessage);
		}
	}
}
```

####```IVideoStoreReporter```
Our last interface will be called ```IVideoStoreReporter``` which will handle our reporting in our method ```RentMovie```.

```csharp
public interface IVideoStoreReporter
{
	void AddMovieToReport(Customer customer, Movie movie);
}
```

And the derived type
####```XmlVideoStoreReporter```

```csharp
public class XmlVideoStoreReporter : IVideoStoreReporter
{
	public void AddMovieToReport(Customer customer, Movie movie)
	{
		XDocument document = XDocument.Load("MovieReport.xml");
		if (document.Root != null)
		{
			document.Root.Add(new XElement("Movie", new XAttribute("id", movie.Id), new XAttribute("title", movie.Title), new XAttribute("rentedBy", customer.Id)));
			document.Save("MovieReport.xml");
		}
	}
}
```

###Constructor injection
Great now you are saying we have all of these classes and interfaces now what are we supposed to do?  Our next step is to refactor our VideoStoreProcessor more by adding two constructors.  One that takes no parameters and one that takes our three dependencies we extracted above.

```csharp
public VideoStoreProcessor()
{
}

public VideoStoreProcessor(IVideoProcessorDataAccess dataAccess, IVideoStoreNotifications storeNotifications, IVideoStoreReporter reporter)
{
	_dataAccess = dataAccess;
	_storeNotifications = storeNotifications;
	_reporter = reporter;
}
```

This is starting to shape up nicely.  But we are missing one important piece of the puzzle, if we use the parameter-less constructor we need to specify types for our interfaces.  Change your parameter-less constructor to call our concrete types.

```csharp
public VideoStoreProcessor() :  this  ( new  SqlVideoProcessorDataAccess ( ) ,  new  SmtpVideoStoreNotifications ( ) ,  new  XmlVideoStoreReporter ( ) ){
}

public VideoStoreProcessor(IVideoProcessorDataAccess dataAccess, IVideoStoreNotifications storeNotifications, IVideoStoreReporter reporter)
{
	_dataAccess = dataAccess;
	_storeNotifications = storeNotifications;
	_reporter = reporter;
}
```

Perfect!
Now let’s finish up and refactor our RentMovie method to use these newly injected dependencies.

```csharp
public void RentMovie(Customer customer, Movie movie)
{
	bool canCustomerRentAMovie = _dataAccess.CanCustomerRentAMovie(customer.Id);
	if (canCustomerRentAMovie)
	{
		//Rent the movie and mark it for shipment
		_dataAccess.RentMovieToCustomer(customer.Id, movie.Id);
		CustomerProfile customerProfile = _dataAccess.GetCustomerProfile(customer.Id);
		if (customerProfile != null)
		{
			if (customerProfile.EmailNotifacation)
			{
				_storeNotifications.SendNotification(customer, movie);
			}
		}
	}
	else
	{
		//Add the movie to thier queue
		_dataAccess.AddMovieToCustomersQueue(customer.Id, movie.Id);
	}

	_reporter.AddMovieToReport(customer, movie);
}
```

Awesome!  All of our dependencies have been extracted. 

###What this means for unit testing.
With these extracted dependencies this means we can create fakes and mocks for our data access layer, notifications, and reporter interfaces.
For example let’s say we create a test method that verifies that the method AddMovieToReport method is called in our RentMovie method on our VideoStoreProcessor.

```csharp
[TestMethod]
public void RentMovie_Information_WritesToReporter()
{
	//Arrange
	var reporterMock = new Mock<IVideoStoreReporter>();
	reporterMock.Setup(r => r.AddMovieToReport(It.IsAny<Customer>(), It.IsAny<Movie>())).AtMostOnce();
	var processor = new VideoStoreProcessor(new FakeDataAccess(), new FakeNotifications(), reporterMock.Object);
	//Act
	processor.RentMovie(new Customer(), new Movie());
	//Assert
	reporterMock.VerifyAll();
}
```

In our arrangement in our unit test we can see we are creating a FakeDataAccess, FakeNotifications and a Mock of IVideoStoreReporter.  (This is using Moq which is outside the scope of this post).  Our first question might be what are these fake classes?
These are simply derived classes from our interface that do not do anything at all and are called Fakes.

```csharp
public class FakeNotifications : IVideoStoreNotifications
{
	public void SendNotification(Customer customer, Movie movie)
	{
	}
}

public class FakeDataAccess : IVideoProcessorDataAccess
{
	public bool CanCustomerRentAMovie(int customerId)
	{
		return true;
	}

	public void RentMovieToCustomer(int customerId, int movieId)
	{
	}

	public void AddMovieToCustomersQueue(int customerId, int movieId)
	{
	}

	public CustomerProfile GetCustomerProfile(int customerId)
	{
		return new CustomerProfile();
	}
}
```

These don’t do anything because our concern of our test does not care about the dataaccess layer or the notification layer; we just want to verify the AddMovieToReport method was called.  If you run this test everything passes and the use of the Mocking framework allowed us to verify that the method was called.
Now let’s say down the line we accidentally remove the call to AddMovieToReport.  Since we have this unit test in place as soon as we run our tests again we will get immediate notification that something is broken.

I hope this post has been informative and can assist you in extracting some dependencies in some existing code so unit testing can be part of each developer’s lives.
