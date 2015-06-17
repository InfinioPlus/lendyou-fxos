$(document).ready(function(){
    var primaryKeys;	// Stores Lends 
    var phoneContacts = [];
    databaseExists();
    getLends();
    getPhoneContacts();

    function getPhoneContacts(){
        var filter = {
            sortBy: 'familyName',
            sortOrder: 'ascending'
        }
        
        var request = window.navigator.mozContacts.getAll(filter);
        
        request.onsuccess = function () {
            if(this.result) {
                phoneContacts.push(this.result.name);
                this.continue();
            }
        }

        request.onerror = function () {
            alert('Something goes wrong!');
        }
    }
    
    var getContacts = function(){
        return function findMatches(q, cb) {
            var matches, substringRegex;
            
            matches = ['Otorrinolaringologo', 'Tails'];
            
            cb(matches);
        }; 
    }

    // check if it is Firefox OS
    if (navigator.userAgent.indexOf('Firefox') > -1 && navigator.userAgent.indexOf("Mobile") > -1){
    
        $('#lendto-txt').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'states',
            source: getContacts()
        }); 
    }
    
    $('.input-group.date').datepicker({
    });
    
    $('#new-lend').hide();
    
    $('#new-lend-btn').click(function(){
        $('#new-lend').slideToggle('slow');
    });
    
    $('#close-btn').click(function(){
        clearForm();
    });
    
    $('#lend-btn').click(function(){
	// Do not add until all fields all filled. 
	if($('#lendwhat-txt').val()!='' && $('#lendto-txt').val()!='' && $('#lendwhen-txt').val()!=''){
		addLend($('#lendwhat-txt').val(), $('#lendto-txt').val(), $('#lendwhen-txt').val());
		getLends();
	}
	else{
		swal("Please enter the missing field(s).");
	}
    });
    
    function clearForm(){
        $('#lendwhat-txt').val('');
        $('#lendto-txt').val('');
        $('#lendwhen-txt').val('');
        $('#new-lend').slideToggle('slow');
    }
    
    function databaseExists(){
        var request = indexedDB.open('lendyou6');
 
        request.onupgradeneeded = function(e)
        {
            var idb = e.target.result;
            
                if (!idb.objectStoreNames.contains('lend'))
                {
                    var store = idb.createObjectStore('lend', {KeyPath: 'Id', autoIncrement: true});
                    store.createIndex('lendwhat', 'lendwhat', {unique: false});
                    store.createIndex('lendto', 'lendto', {unique: false});
                    store.createIndex('lendwhen', 'lndwhen', {unique: false});
                }
        }
    }
    
    function addLend(what, who, when){
        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB || window.mozIndexedDB;
        var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        var openCopy = indexedDB && indexedDB.open;
 
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
 
        if (IDBTransaction)
        {
            IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
            IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
        }
        
        var request = indexedDB.open('lendyou6');
 
        request.onsuccess = function(e)
        {
            var idb = e.target.result;
            var trans = idb.transaction('lend', IDBTransaction.READ_WRITE);
            var store = trans.objectStore('lend');
         
            var requestAdd = store.add({lendwhat: what, lendto: who, lendwhen: when});
         
            requestAdd.onsuccess = function(e) {
                swal('Lend added successfully','','success');
                clearForm();
            };
         
            requestAdd.onfailure = function(e) {
                swal('Failed to add lend: ' + e);
            };
        };
    }
    
    function getLends(){
        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB || window.mozIndexedDB;
        var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        var openCopy = indexedDB && indexedDB.open;
 
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
 
        if (IDBTransaction)
        {
            IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
            IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
        }
        
        
        var html = '';
        
        var request = indexedDB.open('lendyou6');
        request.onsuccess = function(e)
        {
            primaryKeys = [];
            
            idb = e.target.result;
            var transaction = idb.transaction('lend', IDBTransaction.READ_ONLY);
            var objectStore = transaction.objectStore('lend');
         
            objectStore.openCursor().onsuccess = function(event)
            {
                var cursor = event.target.result;
                if (cursor)
                {
                    html += '<li class="list-group-item"> <a href="#">';
                    html += 'Lend my ' + cursor.value.lendwhat + ' to ' + cursor.value.lendto + ' on ' + cursor.value.lendwhen;
                    html += '<span class="pull-right"><span class="glyphicon glyphicon-remove"></span></span></a></li>';
                    primaryKeys.push(cursor.primaryKey);
                    cursor.continue();
                }
                else
                {
                    // we fall here when all entries are displayed
                     $('#lends-list').html(html);
                     
                     $('#lends-list li').click(function(){
                        var index = $(this).parent().children().index(this);
                        
                        swal({
			  title: "Are you sure you want to delete this record?",
			  text: "You will not be able to recover this!",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  confirmButtonText: "Yes, delete it!",
			  cancelButtonText: "No, cancel please!",
			  closeOnConfirm: false,
			  closeOnCancel: false
			},
			function(isConfirm){
			  if (isConfirm) {
				swal("Deleted!", "Your record has been deleted.", "success");
				deleteLend(primaryKeys[index]);
                            	getLends();
			  } else {
				swal("Cancelled", "Deletion Cancelled :)", "error");
			  }
			});
                    });
                }
            };
        };
    }
    
    function deleteLend(index){
        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB || window.mozIndexedDB;
        var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        var openCopy = indexedDB && indexedDB.open;
 
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
 
        if (IDBTransaction)
        {
            IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
            IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
        }
    
        var request = indexedDB.open('lendyou6');
        request.onsuccess = function(e)
        {
            var idb = e.target.result;
            var objectStore = idb.transaction('lend', IDBTransaction.READ_WRITE).objectStore('lend');
            var request = objectStore.delete(index);
         
            request.onsuccess = function(ev)
            {
                console.log(ev);
            };
         
            request.onerror = function(ev)
            {
                console.log('Error occured', ev.srcElement.error.message);
            };
        };
    }
});
