variable "cloudflare_api_token" {
  description = "Cloudflare API token with DNS edit permissions for the zone."
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for kramnameloc.com."
  type        = string
}

variable "github_pages_hostname" {
  description = "GitHub Pages hostname used by the www CNAME record."
  type        = string
  default     = "kramnameloc.github.io"
}
