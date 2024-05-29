FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=nodework /Registration/build .
ENTRYPOINT ["nginx","-g","daemon off;"]