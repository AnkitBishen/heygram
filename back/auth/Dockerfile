FROM golang

WORKDIR /auth

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -v -o /usr/local/bin/app ./cmd

CMD ["app"]