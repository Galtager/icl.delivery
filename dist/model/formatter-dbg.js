sap.ui.define(["sap/ui/core/IconPool"], function (IconPool) {
  var __exports = {
    textMissing(text) {
      return !!text && text || 'חסר';
    },
    textMissingParts(text, text2) {
      return !!text && `${text} ${text2}` || 'חסר';
    },
    accessImage(accessType) {
      switch (accessType) {
        case 'forklift':
          return '../images/forklift.png';
        case 'melaket':
          return '../images/melaket.png';
        case 'ladder':
          return '../images/melaket.png';
        case 'normal':
          return '';
      }
    },
    accessDesc(accessType) {
      switch (accessType) {
        case 'forklift':
          return 'מלגזה';
        case 'melaket':
          return 'מלקטת';
        case 'ladder':
          return 'סולם';
        case 'normal':
          return 'רגיל';
      }
    },
    typeIcon(accessType) {
      switch (accessType) {
        case 'timing':
          return 'sap-icon://history';
        case 'delivery':
          return 'sap-icon://shipping-status';
        case 'argunt':
          return 'sap-icon://BusinessSuiteInAppSymbols/icon-priority-1';
      }
    },
    typeText(accessType) {
      switch (accessType) {
        case 'argunt':
          return 'דחוף';
        case 'delivery':
          return 'הובלה';
        case 'timing':
          return 'מתוזמן';
        default:
          return 'לא הוגדר';
      }
    },
    getIconForMimeType(sMimeType) {
      return IconPool.getIconForMimeType(sMimeType);
    },
    outOfStock(reqAmount, stockAmount) {
      return +reqAmount > +stockAmount ? 'Error' : 'None';
    },
    outOfStockBool(reqAmount, stockAmount) {
      return +reqAmount > +stockAmount;
    },
    datePriority(priority) {
      switch (priority) {
        case '1':
          return 'יום';
        case '2':
          return 'שבוע';
        case '3':
          return 'חודש';
        case '4':
          return 'חודשיים';
        case '5':
          return 'תוך 3 חודשים';
      }
    }
  };
  return __exports;
});
//# sourceMappingURL=formatter.js.map