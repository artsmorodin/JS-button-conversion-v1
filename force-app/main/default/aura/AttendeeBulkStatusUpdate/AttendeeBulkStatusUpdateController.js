({
    onPageReferenceChange: function(cmp, evt, helper) {
        var myPageRef = cmp.get("v.pageReference");
        var invts = myPageRef.state.c__listofInvitees;
        console.log('listofInvitees',JSON.stringify(invts));
        cmp.set("v.listofInvitees",invts);
    }
})
