svn propset author azbitnev -R *.txt css tools tests source
svn propset copyright "(c) 2011 Andrey O. Zbitnev" -R *.txt css tools tests source
svn propset svn:keywords Id -R *.txt css tools tests source

svn propdel author -R jquery
svn propdel copyright -R jquery
svn propdel svn:keywords -R jquery source/css/release source/release
