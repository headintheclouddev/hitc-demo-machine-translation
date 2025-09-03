/**
 * hitcCaseUserEvent.ts
 *
 * @NScriptName HITC Case - User Event
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */
define(["require", "exports", "N/log"], function (require, exports, log) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.beforeSubmit = beforeSubmit;
    function beforeSubmit(context) {
        log.debug('beforeSubmit', `${context.type} case ${context.newRecord.id}`);
        if (context.type == context.UserEventType.CREATE) {
        }
    }
});
