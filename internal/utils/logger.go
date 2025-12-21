package utils

import (
	"context"
	"os"
	"time"

	"github.com/sirupsen/logrus"
	"github.com/google/uuid"
)

type Logger struct {
	*logrus.Logger
}

type contextKey string

const CorrelationIDKey contextKey = "correlation_id"

func NewLogger() *Logger {
	logger := logrus.New()
	
	// JSON format for production
	logger.SetFormatter(&logrus.JSONFormatter{
		TimestampFormat: time.RFC3339,
		FieldMap: logrus.FieldMap{
			logrus.FieldKeyTime:  "timestamp",
			logrus.FieldKeyLevel: "level",
			logrus.FieldKeyMsg:   "message",
		},
	})

	// Set log level based on environment
	if os.Getenv("ENV") == "development" {
		logger.SetLevel(logrus.DebugLevel)
	} else {
		logger.SetLevel(logrus.InfoLevel)
	}

	return &Logger{logger}
}

func (l *Logger) WithCorrelationID(ctx context.Context) *logrus.Entry {
	correlationID := GetCorrelationID(ctx)
	return l.WithField("correlation_id", correlationID)
}

func (l *Logger) LogAuthEvent(ctx context.Context, event, email string, success bool) {
	l.WithCorrelationID(ctx).WithFields(logrus.Fields{
		"event":   event,
		"email":   email,
		"success": success,
		"type":    "auth",
	}).Info("Authentication event")
}

func (l *Logger) LogSecurityEvent(ctx context.Context, event string, data map[string]interface{}) {
	entry := l.WithCorrelationID(ctx).WithFields(logrus.Fields{
		"event": event,
		"type":  "security",
	})
	
	for k, v := range data {
		entry = entry.WithField(k, v)
	}
	
	entry.Warn("Security event")
}

func (l *Logger) LogBusinessEvent(ctx context.Context, event string, data map[string]interface{}) {
	entry := l.WithCorrelationID(ctx).WithFields(logrus.Fields{
		"event": event,
		"type":  "business",
	})
	
	for k, v := range data {
		entry = entry.WithField(k, v)
	}
	
	entry.Info("Business event")
}

func GetCorrelationID(ctx context.Context) string {
	if id, ok := ctx.Value(CorrelationIDKey).(string); ok {
		return id
	}
	return uuid.New().String()
}

func SetCorrelationID(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, CorrelationIDKey, id)
}