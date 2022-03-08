theServer=df-prod
theFolder=/var/www/html/web-test/
export REACT_APP_NODE_ENV='development'

case "$1" in
    "prod")
        theFolder=/var/www/html/web-derify/
        export REACT_APP_NODE_ENV='production'
    ;;
    *)
        # echo 'do nothing'
    ;;
esac

echo "will deploy to folder"$theFolder

echo "start building"
npm run build

echo "start rsync file"
rsync -azPv --delete --progress ./build/ $theServer:$theFolder

echo "deploy to ${theFolder} finished"
