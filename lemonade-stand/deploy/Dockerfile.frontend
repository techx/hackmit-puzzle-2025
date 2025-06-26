FROM debian:bullseye-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y nginx websockify && \
    rm -rf /var/lib/apt/lists/*

COPY dist /usr/share/nginx/html
COPY websocat.x86_64-unknown-linux-musl /usr/local/bin/websocat
COPY nginx.conf /etc/nginx/nginx.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]