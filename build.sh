rm -rf dist

npm run build 

node upload.js

passwd='WYSwill4290'

/usr/bin/expect <<-EOF

set time 30
spawn  scp ./dist/index.html root@1.94.186.245:/root/gateway/html/adm
expect {
"*yes/no" { send "yes\r"; exp_continue }
"*password:" { send "$passwd\r" }
}
expect eof
EOF

