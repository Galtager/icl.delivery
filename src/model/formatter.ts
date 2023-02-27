import IconPool from "sap/ui/core/IconPool";
import { IAccessType, IType } from "../controller/Main.controller";

export default {
    textMissing(text: string): string {
        return !!text && text || 'חסר'
    },
    textMissingParts(text: string, text2: string): string {
        return !!text && `${text} ${text2}` || 'חסר'
    },
    accessImage(accessType: IAccessType) {
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
    accessDesc(accessType: IAccessType) {
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
    typeIcon(accessType: IType) {
        switch (accessType) {
            case 'timing':
                return 'sap-icon://history';
            case 'delivery':
                return 'sap-icon://shipping-status';
            case 'argunt':
                return 'sap-icon://BusinessSuiteInAppSymbols/icon-priority-1';

        }
    },
    typeText(accessType: IType) {
        switch (accessType) {
            case 'argunt':
                return 'דחוף';
            case 'delivery':
                return 'הובלה';
            case 'timing':
                return 'מתוזמן';
            default:
                return 'לא הוגדר'
        }
    },
    getIconForMimeType(sMimeType: string) {
        return IconPool.getIconForMimeType(sMimeType)
    },
    outOfStock(reqAmount: string, stockAmount: string) {
        return +reqAmount > +stockAmount ? 'Error' : 'None'
    },
    outOfStockBool(reqAmount: string, stockAmount: string) {
        return +reqAmount > +stockAmount
    },
    datePriority(priority: '1' | '2' | '3' | '4' | '5') {
        switch (priority) {
            case '1': return 'יום';
            case '2': return 'שבוע';
            case '3': return 'חודש'
            case '4': return 'חודשיים'
            case '5': return 'תוך 3 חודשים'
        }
    }
}