/**
 * hitcCaseUserEvent_done.ts
 *
 * @NScriptName HITC Case - User Event - Done
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

import {EntryPoints} from "N/types";
import log = require('N/log');
import machineTranslation = require('N/machineTranslation');

export function beforeSubmit(context: EntryPoints.UserEvent.beforeSubmitContext) {
  log.debug('beforeSubmit', `${context.type} case ${context.newRecord.id}`);
  if (context.type == context.UserEventType.CREATE) {
    const subject = context.newRecord.getValue({ fieldId: 'title' }) as string;
    const details = context.newRecord.getValue({ fieldId: 'incomingmessage' }) as string;
    const timestamp = Date.now();
    const translations = machineTranslation.translate({
      targetLanguage: machineTranslation.Language.ENGLISH,
      documents: [{ id: `${timestamp}-subject`, text: subject }, { id: `${timestamp}-details`, text: details }]
    });
    log.debug('beforeSubmit', `Translation results for case with subject ${subject}: ${JSON.stringify(translations)}`);
    for (const translationResult of translations.results) {
      if (translationResult.id == `${timestamp}-subject`)
        context.newRecord.setValue({ fieldId: 'title', value: translationResult.text });
      else if (translationResult.id == `${timestamp}-details`)
        context.newRecord.setValue({ fieldId: 'custevent_incoming_message_translated', value: translationResult.text });
    }
  } else if (context.type == context.UserEventType.EDIT) {
    const replyText = context.newRecord.getValue({ fieldId: 'outgoingmessage' }) as string;
    const preferredLanguage = context.newRecord.getText({ fieldId: 'custevent_preferred_language' }) as string;
    if (replyText && preferredLanguage != 'English (US)') { // 1 is English and does not need translation (unless your support reps use different languages)
      const caseNumber = context.newRecord.getValue({ fieldId: 'casenumber' }) as string;
      log.debug('beforeSubmit', `Translating reply on case ${caseNumber} to ${preferredLanguage}: ${replyText}`);
      const translations = machineTranslation.translate({
        targetLanguage: LANGUAGE_MAPPING[preferredLanguage],
        documents: [{ id: caseNumber, text: replyText, language: machineTranslation.Language.ENGLISH }],
      });
      log.debug('beforeSubmit', `Translation results for case ${caseNumber}: ${JSON.stringify(translations)}`);
      if (translations.results.length > 0 && translations.errors.length == 0)
        context.newRecord.setValue({ fieldId: 'outgoingmessage', value: translations.results[0].text });
    }
  }
}

const LANGUAGE_MAPPING = { // TODO: Talk about the source of this
  'English (US)':    machineTranslation.Language.ENGLISH,
  'French (France)': machineTranslation.Language.FRENCH,
  'German':          machineTranslation.Language.GERMAN,
  'Spanish':         machineTranslation.Language.SPANISH
}
