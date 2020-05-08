import { LightningElement,track,api,wire } from 'lwc';
import { ShowToastEvent} from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import INVITEE_OBJECT from '@salesforce/schema/Attendant__c';
import getInviteeRec from '@salesforce/apex/AttendeeListController.getRecords';
// import STATUS_FIELD from '@salesforce/schema/Attendant__c.ZTS_US_Invitation_Status__c';

import {getRecord,updateRecord,generateRecordInputForUpdate,getFieldValue} from 'lightning/uiRecordApi';
import {CurrentPageReference} from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';

export default class Updaterecord extends NavigationMixin(LightningElement) {

    disabled = false;
    @track error;
    @api idList;
    @api status;

    @wire(getInviteeRec, { idList: '$idList'})
    getInviteeRec(result) { 
        
        console.log('result  ::: ' + result);
        if (result.data) {
            var object1 = result.data;
            var recsToUpdate = [];
            for(var item in object1){
                var recId = Object.values(Object.values(object1)[item])[0];
                var record = {
                    fields: {
                        Id: recId,
                        Status__c: this.status,
                    },
                };

                updateRecord(record)
                    .then(() => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Record(s) Is Updated',
                                variant: 'success',
                            }),
                        );
                        this.closeQuickAction();
                    })
                    .catch(error => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Error on data save',
                                message: error.message.body,
                                variant: 'error',
                            }),
                        );
                        this.closeQuickAction();
                    });
            }
        }
        else if(result.error) {
            window.console.log('error', result.error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Query Error.', 
                    message: 'Please select at least one row to update', 
                    variant: 'error' 
                }),
            );
            this.closeQuickAction();
        }
    }

    closeQuickAction() {
        window.console.log('closeQuickAction triggered');
        const close = new CustomEvent('close');
        // Dispatches the event.
        this.dispatchEvent(close);
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Attendant__c',
                actionName: 'list'
            },
            state: {
                // 'filterName' is a property on the page 'state'
                // and identifies the target list view.
                // It may also be an 18 character list view id.
                filterName: 'All' // or by 18 char '00BT0000002TONQMA4'
            }
        });
    }
}