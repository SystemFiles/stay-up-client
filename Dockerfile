FROM node:16.13.1-alpine3.15 as builder

# Install project dependencies
WORKDIR /build
COPY package.json .
RUN yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

# Copy project files and create production build
COPY . .
RUN yarn build

# Remove excess weight
RUN rm -rf node_modules && \
  NODE_ENV=production yarn install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true

# Build final image for deployment
FROM node:16.13.1-alpine3.15

# Author labels
LABEL maintainer="Ben Sykes"
LABEL authors="Ben Sykes"

# Copy build result
WORKDIR /app
COPY --from=builder /build .

# Set net params
ENV HOST=0.0.0.0
EXPOSE 80

CMD [ "yarn", "start" ]