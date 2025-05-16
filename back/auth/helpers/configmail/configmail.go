package configmail

import (
	"fmt"
	"net/smtp"
	"os"
	"strings"
)

func ProcessMail(to []string, msg string, subject string) (bool, error) {

	env_mailU := os.Getenv("MAIL_USER")
	env_mailP := os.Getenv("MAIL_PASS")
	if env_mailU == "" || env_mailP == "" {
		return false, fmt.Errorf("mail user and password is missing in .evn file")
	}

	from := env_mailU
	password := env_mailP
	host := "smtp.gmail.com"
	port := "587"

	toList := to
	allTos := strings.Join(to, ",")
	headers := "From: " + from + "\r\n" +
		"To: " + allTos + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/plain; charset=\"utf-8\"\r\n" +
		"\r\n"

	body := []byte(headers + msg)
	auth := smtp.PlainAuth("", from, password, host)

	err := smtp.SendMail(host+":"+port, auth, from, toList, body)
	if err != nil {
		return false, err
	}

	fmt.Println("Successfully sent mail to all user in toList")
	return true, nil
}
