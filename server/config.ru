#\ -w -p 8080

require 'roda'

class App < Roda
  plugin :default_headers, 'Access-Control-Allow-Origin' => '*'

  route do |r|
    r.on 'polling' do
      response.status = 404
      ''
    end
  end
end

run App.freeze.app
