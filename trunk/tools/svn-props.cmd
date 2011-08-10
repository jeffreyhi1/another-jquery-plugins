@rem svn propset copyright "(c) 2011 Andrey O. Zbitnev" *.txt css\* tools\* tests\*
@rem svn propset copyright "(c) 2011 Andrey O. Zbitnev" source\* source\graphics\* source\thinks\* source\thinks\typo\* source\css\* source\css\theme\* source\release\* source\css\release\* source\css\release\theme\*
@rem svn propset copyright "(c) 2011 Andrey O. Zbitnev" examples\autocomplete\* examples\autoheight\* examples\bindkeys\* examples\customcheckbox\* examples\customselect\* examples\datepicker\* examples\dragndrop\* examples\easing\* examples\editable\* examples\menu\* examples\msgbox\* examples\paginator\* examples\placeholder\* examples\resizable\* examples\scrollable\* examples\slider\* examples\starating\* examples\tagscloud\* examples\tooltip\*

svn propset author azbitnev -R *.txt css tools tests source
svn propset copyright "(c) 2011 Andrey O. Zbitnev" -R *.txt css tools tests source
svn propset svn:keywords Id -R *.txt css tools tests source

svn propdel author -R jquery
svn propdel copyright -R jquery
svn propdel svn:keywords -R jquery
