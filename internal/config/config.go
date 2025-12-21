package config

import (
	"errors"
	"os"
	"strconv"
	"time"
)

type Config struct {
	Port string
	Env  string

	// Database
	NeonDatabaseURL string // Full Neon connection string
	DBHost          string
	DBPort          string
	DBUser          string
	DBPassword      string
	DBName          string
	DBSSLMode       string

	// Redis
	UpstashRedisURL   string // Upstash Redis URL
	UpstashRedisToken string // Upstash Redis token
	RedisHost         string
	RedisPort         string
	RedisPassword     string
	RedisDB           int

	// JWT
	JWTSecret        string
	JWTAccessExpiry  time.Duration
	JWTRefreshExpiry time.Duration

	// Email
	SMTPHost     string
	SMTPPort     int
	SMTPUser     string
	SMTPPassword string
	EmailFrom    string
	BaseURL      string
	FrontendURL  string

	// Security
	BcryptCost        int
	RateLimitRequests int
	RateLimitWindow   time.Duration
	SessionTimeout    time.Duration
	AccountLockoutDuration time.Duration
	MaxFailedAttempts      int
	PasswordComplexity     bool
	CSRFProtection         bool
	RequestTimeout         time.Duration
}

func Load() *Config {
	return &Config{
		Port: getEnv("PORT", "8080"),
		Env:  getEnv("ENV", "development"),

		NeonDatabaseURL: getEnv("NEON_DATABASE_URL", ""),
		DBHost:          getEnv("DB_HOST", "localhost"),
		DBPort:          getEnv("DB_PORT", "5432"),
		DBUser:          getEnv("DB_USER", "authuser"),
		DBPassword:      getEnv("DB_PASSWORD", "authpassword"),
		DBName:          getEnv("DB_NAME", "authdb"),
		DBSSLMode:       getEnv("DB_SSLMODE", "disable"),

		UpstashRedisURL:   getEnv("UPSTASH_REDIS_URL", ""),
		UpstashRedisToken: getEnv("UPSTASH_REDIS_TOKEN", ""),
		RedisHost:         getEnv("REDIS_HOST", "localhost"),
		RedisPort:         getEnv("REDIS_PORT", "6379"),
		RedisPassword:     getEnv("REDIS_PASSWORD", ""),
		RedisDB:           getEnvAsInt("REDIS_DB", 0),

		JWTSecret:        getEnv("JWT_SECRET", "your-secret-key"),
		JWTAccessExpiry:  getEnvAsDuration("JWT_ACCESS_EXPIRY", "15m"),
		JWTRefreshExpiry: getEnvAsDuration("JWT_REFRESH_EXPIRY", "7d"),

		SMTPHost:     getEnv("SMTP_HOST", "smtp.gmail.com"),
		SMTPPort:     getEnvAsInt("SMTP_PORT", 587),
		SMTPUser:     getEnv("SMTP_USER", ""),
		SMTPPassword: getEnv("SMTP_PASS", ""),
		EmailFrom:    getEnv("EMAIL_FROM", "noreply@example.com"),
		BaseURL:      getEnv("BASE_URL", "http://localhost:8080"),
		FrontendURL:  getEnv("FRONTEND_URL", "http://localhost:3000"),

		BcryptCost:             getEnvAsInt("BCRYPT_COST", 12),
		RateLimitRequests:      getEnvAsInt("RATE_LIMIT_REQUESTS", 10),
		RateLimitWindow:        getEnvAsDuration("RATE_LIMIT_WINDOW", "1m"),
		SessionTimeout:         getEnvAsDuration("SESSION_TIMEOUT", "30m"),
		AccountLockoutDuration: getEnvAsDuration("ACCOUNT_LOCKOUT_DURATION", "30m"),
		MaxFailedAttempts:      getEnvAsInt("MAX_FAILED_ATTEMPTS", 5),
		PasswordComplexity:     getEnvAsBool("PASSWORD_COMPLEXITY", true),
		CSRFProtection:         getEnvAsBool("CSRF_PROTECTION", true),
		RequestTimeout:         getEnvAsDuration("REQUEST_TIMEOUT", "30s"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getEnvAsDuration(key string, defaultValue string) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	duration, _ := time.ParseDuration(defaultValue)
	return duration
}

func getEnvAsBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		return value == "true" || value == "1"
	}
	return defaultValue
}

func (c *Config) Validate() error {
	// JWT Secret validation
	if c.JWTSecret == "your-secret-key" || c.JWTSecret == "" {
		return errors.New("JWT_SECRET must be set and changed from default")
	}
	if len(c.JWTSecret) < 32 {
		return errors.New("JWT_SECRET must be at least 32 characters for security")
	}
	
	// Bcrypt cost validation
	if c.BcryptCost < 10 {
		return errors.New("BCRYPT_COST must be at least 10")
	}
	if c.BcryptCost > 14 {
		return errors.New("BCRYPT_COST should not exceed 14 (performance impact)")
	}
	
	// Rate limiting validation
	if c.RateLimitRequests < 1 {
		return errors.New("RATE_LIMIT_REQUESTS must be positive")
	}
	
	// Production environment checks
	if c.Env == "production" {
		if c.NeonDatabaseURL == "" {
			return errors.New("NEON_DATABASE_URL must be set in production")
		}
		if c.UpstashRedisURL == "" || c.UpstashRedisToken == "" {
			return errors.New("Upstash Redis credentials must be set in production")
		}
		if !c.CSRFProtection {
			return errors.New("CSRF_PROTECTION must be enabled in production")
		}
		if c.FrontendURL == "" || c.FrontendURL == "http://localhost:3000" {
			return errors.New("FRONTEND_URL must be set to production URL (current: " + c.FrontendURL + ")")
		}
	}
	
	return nil
}
