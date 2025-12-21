package databases

import (
	"context"
	"crypto/tls"
	"fmt"

	"github.com/Flack74/go-auth-system/internal/config"
	"github.com/redis/go-redis/v9"
)

func NewRedisClient(cfg *config.Config) *redis.Client {
	var client *redis.Client
	
	// Use Upstash if URL is provided (production), otherwise use standard Redis (development)
	if cfg.UpstashRedisURL != "" {
		client = redis.NewClient(&redis.Options{
			Addr:     cfg.UpstashRedisURL,
			Password: cfg.UpstashRedisToken,
			TLSConfig: &tls.Config{MinVersion: tls.VersionTLS12},
		})
	} else {
		client = redis.NewClient(&redis.Options{
			Addr:     fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort),
			Password: cfg.RedisPassword,
			DB:       cfg.RedisDB,
		})
	}

	// Test connection
	ctx := context.Background()
	if err := client.Ping(ctx).Err(); err != nil {
		panic("Failed to connect to Redis: " + err.Error())
	}

	return client
}
