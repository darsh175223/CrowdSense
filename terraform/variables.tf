variable "aws_region" {
  description = "AWS region to deploy resources"
}

variable "project_name" {
  description = "Name of the project"
  default     = "traffictrend"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "key_name" {
  description = "Name of the SSH key pair to access EC2 instances"
}
