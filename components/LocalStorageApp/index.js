import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, useMemo } from "react";
import { HeaderContext } from "../Header";
import StartingPage from "../StartingPage";
import OHAEditor from "../OHAEditor";
import { makeStyles } from "@material-ui/core/styles";
import ErrorToasts from "../ErrorToasts";
import useErrors from "../../utils/use-errors.js";
import useLocalStorage from "../../utils/use-local-storage.js";
var useStyles = makeStyles({
  empty: {
    textAlign: "center",
    padding: 100,
    color: "#666",
    fontSize: 28
  }
});
export default (function () {
  var c = useStyles();

  var _useState = useState("welcome"),
      _useState2 = _slicedToArray(_useState, 2),
      pageName = _useState2[0],
      changePageName = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      currentFile = _useState4[0],
      changeCurrentFile = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      oha = _useState6[0],
      changeOHA = _useState6[1];

  var _useErrors = useErrors(),
      _useErrors2 = _slicedToArray(_useErrors, 2),
      errors = _useErrors2[0],
      addError = _useErrors2[1];

  var _useLocalStorage = useLocalStorage("recentItems", []),
      _useLocalStorage2 = _slicedToArray(_useLocalStorage, 2),
      recentItems = _useLocalStorage2[0],
      changeRecentItems = _useLocalStorage2[1];

  var onCreateTemplate = useMemo(function () {
    return function (template) {
      changeCurrentFile({
        fileName: "unnamed",
        content: JSON.stringify(template.oha, null, "  "),
        id: Math.random().toString().split(".")[1]
      });
      changeOHA(template.oha);
      changePageName("edit");
    };
  }, []);
  var openRecentItem = useMemo(function () {
    return function (item) {
      changeCurrentFile(item);

      try {
        changeOHA(JSON.parse(item.content));
      } catch (e) {
        addError("Couldn't parse content into JSON");
      }

      changePageName("edit");
    };
  });
  var onClickHome = useMemo(function () {
    return function () {
      changePageName("welcome");
    };
  }, []);
  var handleOpenFile = useMemo(function () {
    return function (file) {
      var fileName = file.name;
      var reader = new FileReader();

      reader.onload = function (e) {
        var content = e.target.result;

        try {
          var _oha = JSON.parse(content); // TODO validate OHA and prompt to open anyway if invalid


          changeCurrentFile({
            fileName: fileName,
            content: content,
            id: Math.random().toString().split(".")[1]
          });
          changeOHA(_oha);
          changePageName("edit");
        } catch (e) {
          console.log(e.toString());
          addError("Could not read file \"".concat(file.name, "\""));
        }
      };

      reader.readAsText(file);
    };
  }, []);
  return React.createElement(React.Fragment, null, React.createElement(HeaderContext.Provider, {
    value: {
      recentItems: recentItems,
      onClickTemplate: onCreateTemplate,
      onClickHome: onClickHome,
      onOpenFile: handleOpenFile,
      onOpenRecentItem: openRecentItem
    }
  }, pageName === "welcome" ? React.createElement(StartingPage, {
    onFileDrop: handleOpenFile,
    onOpenTemplate: onCreateTemplate
  }) : pageName === "edit" && currentFile ? React.createElement(OHAEditor, Object.assign({
    key: currentFile.id
  }, currentFile, {
    oha: oha,
    onChangeFileName: function onChangeFileName(newName) {
      changeCurrentFile(_objectSpread({}, currentFile, {
        fileName: newName
      }));
    },
    onChangeContent: function onChangeContent(newContent) {
      var newFile = _objectSpread({}, currentFile, {
        content: newContent
      });

      changeCurrentFile(newFile);

      if (recentItems.map(function (item) {
        return item.id;
      }).includes(newFile.id)) {
        changeRecentItems(recentItems.map(function (ri) {
          return ri.id === newFile.id ? newFile : ri;
        }));
      } else {
        changeRecentItems([newFile].concat(recentItems).slice(0, 3));
      }
    },
    onChangeOHA: changeOHA
  })) : React.createElement("div", {
    className: c.empty
  }, "Unknown Page \"", pageName, "\"")), React.createElement(ErrorToasts, {
    errors: errors
  }));
});