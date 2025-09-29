/**
 * hitcCaseUserEvent_done.ts
 *
 * @NScriptName HITC Case - User Event - Done
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */
define(["require", "exports", "N/log", "N/machineTranslation"], function (require, exports, log, machineTranslation) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.beforeSubmit = beforeSubmit;
    function beforeSubmit(context) {
        log.debug('beforeSubmit', `${context.type} case ${context.newRecord.id}`);
        if (context.type == context.UserEventType.CREATE) {
            const subject = context.newRecord.getValue({ fieldId: 'title' });
            const details = context.newRecord.getValue({ fieldId: 'incomingmessage' });
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
        }
        else if (context.type == context.UserEventType.EDIT) {
            const replyText = context.newRecord.getValue({ fieldId: 'outgoingmessage' });
            const preferredLanguage = context.newRecord.getText({ fieldId: 'custevent_preferred_language' });
            if (replyText && preferredLanguage && preferredLanguage != 'English (US)') { // English does not need translation (unless your support reps use different languages)
                const caseNumber = context.newRecord.getValue({ fieldId: 'casenumber' });
                log.debug('beforeSubmit', `Translating reply on case ${caseNumber} to ${preferredLanguage}: ${replyText}`);
                const translations = machineTranslation.translate({
                    targetLanguage: LANGUAGE_MAPPING[preferredLanguage],
                    documents: [{ id: caseNumber, text: replyText, language: machineTranslation.Language.ENGLISH }],
                });
                log.debug('beforeSubmit', `Translation results for case ${caseNumber}: ${JSON.stringify(translations)}`);
                if (translations.results.length > 0 && translations.errors.length == 0)
                    context.newRecord.setValue({
                        fieldId: 'outgoingmessage',
                        value: translations.results[0].text + '<p>--------------------------------------<br />Original Text:</p>' + replyText
                    });
            }
        }
    }
    const LANGUAGE_MAPPING = {
        'Arabic': machineTranslation.Language.ARABIC,
        'English (US)': machineTranslation.Language.ENGLISH,
        'French (France)': machineTranslation.Language.FRENCH,
        'German': machineTranslation.Language.GERMAN,
        'Spanish': machineTranslation.Language.SPANISH
    };
});
