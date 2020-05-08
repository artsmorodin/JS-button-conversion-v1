public with sharing class AttendeeListController {

    public List<Attendant__c> selInviteeLst;
    public String attndIds;

    public AttendeeListController(ApexPages.StandardSetController cntlr){
        //Getting list of ids from records selected in the list view 
        selInviteeLst = cntlr.getSelected();
        attndIds = '';  
        //Convert selected records into a string of comma separated ids
        for(Attendant__c invt : selInviteeLst){
            attndIds += invt.Id + ',';                       
        }
        attndIds = attndIds.removeEnd(','); 
    } 

    public PageReference redirectToLC(){
        //Redirecting to AURA component and pass list of ids as a parameter 
        String returnUrl = '/lightning/cmp/c__AttendeeBulkStatusUpdate?c__listofInvitees='+attndIds;
        PageReference pgReturnPage = new PageReference(returnUrl);
        pgReturnPage.setRedirect(true);
        return pgReturnPage;
    }

    @AuraEnabled(cacheable=true)
    public static List<Attendant__c> getRecords(String idList) {
        Set<Id> updatedIdList = new Set<Id>(); 
        System.System.debug(':::::::::::::');
        if(idList.contains(',')){

            List<String> getList= new List<String>(idList.split(','));
            for (String newID :getList){
                updatedIdList.add(Id.valueOf(newID));
            }
        }
        else updatedIdList.add(Id.valueOf(idList));

        return [
            SELECT Id,Status__c
            FROM Attendant__c
            WHERE Id =:updatedIdList
        ];
    }
}