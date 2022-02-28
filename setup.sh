export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"
rbenv global 3.0.2
foreman start -f Procfile.dev
