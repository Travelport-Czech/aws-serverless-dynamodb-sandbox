# AWS Serverless DynamoDB Sandbox

## Needed applications

* Node

## Prepare development enviroment

Authenticating to GitHub Packages
see [there](https://help.github.com/en/github/managing-packages-with-github-packages/configuring-npm-for-use-with-github-packages#authenticating-to-github-packages)

* Clone project
* Install dependencies
```bash
> npm install
```
* Install local database
```bash
> npx sls dynamodb install
``` 
* Run offline
```bash
> npm run offline
```
* Send POST request to
```
http://localhost:3000

data:

{
    "value": "my value" 
}
```

## Prepare deployment enviroment

### Install AWS CLI

1. Verify that Python and pip are both installed correctly with the following commands:

```
> python --version
Python 3.6.2
> pip --version
pip 9.0.1 from c:\users\myname\appdata\local\programs\python\python36\lib\site-packages (python 3.6)
```

2. Install the AWS CLI using pip:

```
> pip install awscli
```

3. Verify that the AWS CLI is installed correctly:

```
> aws --version
aws-cli/1.11.84 Python/3.6.2 Windows/7 botocore/1.5.47
```

To upgrade to the latest version, run the installation command again:

```
> pip install --user --upgrade awscli
```

### Add AWS credentials

Add your account credentials
```
> aws configure
AWS Access Key ID [None]: xxx
AWS Secret Access Key [None]: xxx
Default region name [None]: eu-west-1
Default output format [None]: ENTER
```

Open file `~/.aws/credentials` and modify profile name to `aws-serverless-dynamodb-sandbox`:

```
[aws-serverless-dynamodb-sandbox]
aws_access_key_id=***************
aws_secret_access_key=***************
```

### Deploy

Run:
```
> npm run deploy
```
