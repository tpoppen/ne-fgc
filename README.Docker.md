### Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:3000.

# TODO:
- Get docker image working with Github actions to push to AWS ECR
- Get EC2 instance running
  - Get EC2 instance specific aws profile for limited permissions
  - Get EC2 instance polling from ECR to launch new image
