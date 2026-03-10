# Cloudflare DNS for GitHub Pages (`kramnameloc.com`)

This Terraform config creates the DNS records needed for GitHub Pages:

- Apex `A` records for `kramnameloc.com`
- Apex `AAAA` records for `kramnameloc.com`
- `www` CNAME pointing to `kramnameloc.github.io`

## Prerequisites

- Terraform `>= 1.5`
- A Cloudflare API token with DNS edit access to the `kramnameloc.com` zone
- Cloudflare zone ID for `kramnameloc.com`

## Usage

From this directory:

```bash
terraform init
cp terraform.tfvars.example terraform.tfvars
```

Set your Cloudflare token as an environment variable:

```bash
export TF_VAR_cloudflare_api_token="replace-with-your-cloudflare-api-token"
```

Edit `terraform.tfvars` and set your real zone ID, then apply:

```bash
terraform plan -out tfplan
terraform apply tfplan
```

## Notes

- Records are set with `proxied = false` (DNS only), which is the common baseline for GitHub Pages.
- This repo already has a `CNAME` file for `kramnameloc.com`.
