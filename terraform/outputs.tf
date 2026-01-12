output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend_bucket.bucket
}

output "backend_public_ip" {
  value = aws_instance.backend_server.public_ip
}
