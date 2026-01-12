resource "aws_security_group" "web_sg" {
  name        = "${var.project_name}-sg"
  description = "Allow HTTP, HTTPS, and SSH"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 5002
    to_port     = 5002
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Suggest narrowing this in production
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# S3 Bucket for Angular Frontend Hosting
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "${var.project_name}-frontend-${random_id.bucket_id.hex}"
 
  tags = {
    Name = "Angular Frontend"
  }
}

resource "random_id" "bucket_id" {
  byte_length = 4
}

# EC2 Instance for Backend Services (Spring Boot + Python)
resource "aws_instance" "backend_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS (us-east-1), change if using different region
  instance_type = var.instance_type
  key_name      = var.key_name
  security_groups = [aws_security_group.web_sg.name]

  tags = {
    Name = "${var.project_name}-backend"
  }

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y openjdk-17-jdk python3-pip
              # Add steps here to pull code/artifacts from S3 or Git and run services
              EOF
}
