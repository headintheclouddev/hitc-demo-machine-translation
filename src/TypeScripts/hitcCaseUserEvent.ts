/**
 * hitcCaseUserEvent.ts
 *
 * @NScriptName HITC Case - User Event
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

import {EntryPoints} from "N/types";
import log = require('N/log');

export function beforeSubmit(context: EntryPoints.UserEvent.beforeSubmitContext) {
  log.debug('beforeSubmit', `${context.type} case ${context.newRecord.id}`);
  if (context.type == context.UserEventType.CREATE) {

  }
}
