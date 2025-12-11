terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "astrygo-webhosting"
  region  = "europe-west2"
}

# Service Account لتشغيل auth-api
resource "google_service_account" "auth_api_runtime" {
  account_id   = "auth-api-runtime"
  display_name = "Astrygo Auth API Runtime"
}

# Cloud Run Service: auth-api
resource "google_cloud_run_v2_service" "auth_api" {
  name     = "auth-api"
  location = "europe-west2"

  template {
    service_account = google_service_account.auth_api_runtime.email

    containers {
      # Docker image اللي رفعناه
      image = "europe-west2-docker.pkg.dev/astrygo-webhosting/webhosting-docker/auth-api:prof-healthz-1"

      env {
        name  = "ACCESS_TOKEN_SECRET"
        value = var.auth_api_access_token_secret
      }
    }
  }

  ingress = "INGRESS_TRAFFIC_ALL"

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

# متغير للـ JWT secret
variable "auth_api_access_token_secret" {
  type        = string
  description = "JWT signing secret for auth API"
}

# إخراج رابط Cloud Run
output "auth_api_url" {
  value = google_cloud_run_v2_service.auth_api.uri
}

resource "google_cloud_run_v2_service_iam_member" "auth_api_public_invoker" {
  project  = "astrygo-webhosting"
  location = "europe-west2"
  name     = google_cloud_run_v2_service.auth_api.name

  role   = "roles/run.invoker"
  member = "allUsers"
}

