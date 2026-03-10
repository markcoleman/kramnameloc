---
layout: "post"
title: "Azure ❤️ Terraform"
date: 2019-01-22 21:07:10 -0500
description: "Getting started with terraform with the azure provider"
summary: "Getting started with terraform with the azure provider"
subtitle: "Getting started with terraform with the azure provider"
tags:
  - cloud
  - devops
  - career
---
I recently have been exploring the concept of infrastructure as code and how all the core concepts we use day in day out in our software development life cycle could apply to infrastructure resources.  This idea eventually brought me to [terraform](https://www.terraform.io) and how it can be applied to azure resources.  I started following along with the [Getting started guide for azure](https://www.terraform.io/docs/providers/azurerm/index.html) and pieced together a couple steps to follow to get a new user to terraform up and running relatively quickly.

## Setting Up Your Workstation

Terraform authenticates to azure resources by leveraging the azure command line interface and the azure APIs and needs to be installed if you do not have it already.

Azure cli

```
brew install azure-cli
```

Install terraform

```
 brew install terraform
```

_Optional Visual Studio Code Extension_ - This is an optional step, however the extension does increase productivity in VSCode for resource navigation and a module view.

```
code --install-extension ms-azuretools.vscode-azureterraform
```

## Setting Your Azure Subscription

If you happen to have multiple azure subscriptions it is *important* you set the subscription id correctly otherwise you will be terraforming a subscription you probably did not plan on terraforming.

Login via the Azure cli

```
az login
```

List all of your Accounts and capture the `"id"` of the account you wish to terraform

```
❯ az account list
```
```
[
  {
    "cloudName": "AzureCloud",
    "id": "10000000-0000-0000-0000-000000000000",
    "isDefault": false,
    "name": "Subscription Name",
    "state": "Enabled",
    "tenantId": "00000000-0000-0000-0000-000000000000",
    "user": {
      "name": "email@user.name",
      "type": "user"
    }
  }
]
```

Set the subscription via the `"id"` you recored above.

```
az account set --subscription="10000000-0000-0000-0000-000000000000"
```


## Setting Up Your Sample Project

Terraform works via `tf` configuration files that define your infrastructure resources.

```
touch core.tf
```

### Define the Provider

The first entry in your `tf` should be the provider you wish to target, in this case it is the azure resource manager.

```
provider "azurerm" {
}
```

Once that is defined and saved we will need to run the initialize command to pull down the azure provider plugin.

```
terraform init
Initializing provider plugins...
- Checking for available provider plugins on https://releases.hashicorp.com...
- Downloading plugin for provider "azurerm" (1.21.0)...
```

### Our First Resource

Now that we have a provider defined it is time to create our first resource.  The simplest resource to create is of course a resource group.

```
resource "azurerm_resource_group" "azurerm_resource_group" {
  name     = "azure-loves-terraform"
  location = "eastus"
}
```

Our resource is looking quite nice, but as any code it sure would be helpful to define a variable just in case we wish to switch the location around at will.  This can be accomplished with variables.

Create `variables.tf`

```
variable "region" {
  default = "eastus"
}
```

Now with the variables file created we can alter our resource to reference that variable throughout our resource definition.

```
provider "azurerm" {}

resource "azurerm_resource_group" "azurerm_resource_group" {
  name     = "azure-loves-terraform"
  location = "${var.region}"
}
```


## Trying It Out

To publish any of our changes to our subscription we will need to execute a plan which refreshes the state from the defined terraform configuration and how it relates to the actual resources in our subscription.  This will show the diff needed via creations, updates, or deletions of resources based upon what terraform calculates.  We specify the `-out` flag so we can apply the change later. _This step does not actually push any changes_

```
terraform plan -out build-core
Refreshing Terraform state in-memory prior to plan...
The refreshed state will be used to calculate this plan, but will not be
persisted to local or remote state storage.


------------------------------------------------------------------------

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  + azurerm_resource_group.azurerm_resource_group
      id:       <computed>
      location: "eastus"
      name:     "azure-loves-terraform"
      tags.%:   <computed>


Plan: 1 to add, 0 to change, 0 to destroy.

------------------------------------------------------------------------

This plan was saved to: build-core

To perform exactly these actions, run the following command to apply:
    terraform apply "build-core"
```

If you examine the output you can see the plan will create one new resource in our subscription with 0 changes and 0 deletions.

To apply the changes and deploy to your subscription from the plan we can run the apply command with saved plan state.

```
terraform apply "build-core"  
azurerm_resource_group.azurerm_resource_group: Creating...
  location: "" => "eastus"
  name:     "" => "azure-loves-terraform"
  tags.%:   "" => "<computed>"
azurerm_resource_group.azurerm_resource_group: Creation complete after 1s (ID: /subscriptions/10000000-0000-0000-0000-000000000000/resourceGroups/azure-loves-terraform)

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

## Welcome Infrastructure as Code

I am looking forward to more time exploring terraform and how it can assist in infrastructure drift, peer review, and the concept of continual delivery of infrastructure.
