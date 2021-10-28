export REACT_APP_NODE_ENV='development'
git checkout dev
git pull
npm run build
scp -i ~/Documents/test-new.pem -r ./build/* ubuntu@ec2-13-125-43-43.ap-northeast-2.compute.amazonaws.com:/var/www/html/web-test/
