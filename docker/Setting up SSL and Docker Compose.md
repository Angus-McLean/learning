# Setting up SSL and Docker Compose


## **Overview**
    The aim is to protect your applciation's traffic using SSL (https). We will need to create Signed Certificates and configure nginx to use them inorder to achieve this.
    Once this is done and configured we will have to integrate the process into our automated build process so that certificates persist between builes and we don't expose the server secret key anywhere.
*    **Let's get started!***


## **SSL with Docker by hand**
### 1. Setup a persistent Data Volume Container

```bash
# Create named data volume container and mount volume /certs
docker create -v /certs --name envartifacts ubuntu
```
### 2. Create self-signed certificate with Ubuntu Container

```bash
# Run docker container
docker run -i -t --volumes-from envartifacts ubuntu /bin/bash

# Initialize the package cache and install opensll
apt-get -qq update
apt-get install openssl -y

# Generate a certificate signing request (CSR) and server private key
# CSR => /certs/server.csr && Private Key => /certs/server.key
openssl req -out /certs/server.csr -new -newkey rsa:2048 -sha256 -nodes -keyout /certs/server.key -subj "/C=CA/ST=QC/L=Sogema/O=example.com/emailAddress=webmaster@example.com/CN=localhost"

# Self sign the csr to create a signed certificate (crt)
openssl x509 -req -sha256 -days 365 -in /certs/server.csr -signkey /certs/server.key -out /certs/server.crt
```
### 3. Configure Nginx Container

```bash
server {
    listen       4200;
    listen       4201 ssl;
    
    ssl_certificate    /certs/server.crt;
    ssl_certificate_key    /certs/server.key;
    
    ## Other Nginx Directives ##
}
```


## **Automated SSL in DevEnv (self-signed)**






## **Automated SSL in ProdEnv (CA-signed)**
