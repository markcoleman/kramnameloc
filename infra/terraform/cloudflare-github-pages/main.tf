terraform {
  required_version = ">= 1.5.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

locals {
  github_pages_ipv4 = toset([
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153",
  ])

  github_pages_ipv6 = toset([
    "2606:50c0:8000::153",
    "2606:50c0:8001::153",
    "2606:50c0:8002::153",
    "2606:50c0:8003::153",
  ])
}

resource "cloudflare_record" "apex_a" {
  for_each = local.github_pages_ipv4

  zone_id = var.cloudflare_zone_id
  name    = "@"
  type    = "A"
  content = each.value
  ttl     = 1
  proxied = false
}

resource "cloudflare_record" "apex_aaaa" {
  for_each = local.github_pages_ipv6

  zone_id = var.cloudflare_zone_id
  name    = "@"
  type    = "AAAA"
  content = each.value
  ttl     = 1
  proxied = false
}

resource "cloudflare_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  type    = "CNAME"
  content = var.github_pages_hostname
  ttl     = 1
  proxied = false
}
