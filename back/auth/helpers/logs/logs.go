package logs

import (
	"log/slog"
	"os"
	"path/filepath"
)

func WriteLogs(data any) {

	currentPath, _ := filepath.Abs("./")
	logFile, err := os.OpenFile(currentPath+"/app.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
	if err != nil {
		panic(err)
	}
	defer logFile.Close()

	slogger := slog.New(slog.NewTextHandler(logFile, nil))
	slogger.Info("log:", data)

}
