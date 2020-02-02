#\ -w -p 8080

require 'roda'
require 'redis'

REDIS_HOST = '127.0.0.1'.freeze
REDIS_PORT = 6379
REDIS_DB = 1

class App < Roda
  plugin :default_headers, 'Access-Control-Allow-Origin' => '*'
  plugin :json

  route do |r|
    r.on 'polling' do
      if counter.to_i < 5
        response.status = 404
        'Not Found'
      else
        reset_counter
        { 'counter' => counter }
      end
    end
  end

  private

  def redis
    @redis ||= Redis.new(host: REDIS_HOST, port: REDIS_PORT, db: REDIS_DB)
  end

  def counter
    @counter ||= redis.incr 'counter'
  end

  def reset_counter
    redis.del 'counter'
  end
end

run App.freeze.app
