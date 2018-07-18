// in case the document is already rendered
if (document.readyState!='loading') init();
// modern browsers
else if (document.addEventListener) document.addEventListener('DOMContentLoaded', init);
// IE <= 8
else document.attachEvent('onreadystatechange', function(){
    if (document.readyState=='complete') init();
});
function init() {
   if(localStorage.taskListStored){
       taskList=JSON.parse(localStorage.getItem('taskListStored'));
        taskList.forEach(function(task){
            populateTasks(task.name, task.discription,true,task.id);
        });
    }

    if(taskList.length==0)  showMsg(document.getElementById('empty-msg'),'No Tasks Available');
    //check for the tasks
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    var search = document.getElementById("search");
    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
        submitButttonListener();
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    $("#search").on("keyup", function() {
        var reasultFound = false; 
        if(taskList.length!=0)
        {  
            let value = $(this).val().toLowerCase();
            $(".detail .task .title").filter(function() {
                let parent = $(this).parent().parent(); 
                if($(this).text().indexOf(value) > -1) reasultFound = true;
                parent.toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
            if(!reasultFound)
            showMsg(document.getElementById('empty-msg'),'No Match Found');
            else hideMsg(document.getElementById('empty-msg'));
        }
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    } 

    editOrDeleteTask();
}

function hideMsg(element){
    element.classList.add("hide");
}

function showMsg(element,msg){
    element.innerText = msg;
    element.classList.remove("hide");
}

var taskList = [];
var totalTasks = 0;

function submitButttonListener(taskNameElement,taskDetailElement){
    var submit = document.getElementById("submit-task");
    var modal = document.getElementById('myModal');
    var duplicateEntry = false;
    submit.onclick = function(){
        let taskName = document.getElementById("task-name");
        let taskDetail = document.getElementById("task-discription");
        debugger;
        if(taskName.value == '' ||taskDetail.value=='') {
            showMsg(document.getElementById('fields-check-msg'),'Please fill all the fields');
            return;
        }
        else  hideMsg(document.getElementById('fields-check-msg'));
        modal.style.display = "none";
        if(taskNameElement!= undefined && taskDetailElement!= undefined)
        {
            // setting target values for edit 
            taskNameElement.innerText = taskName.value;
            taskDetailElement.innerText = taskDetail.value;
            taskList = taskList.map(function(task) {
                 if(task.id === taskNameElement.getAttribute('id')) {
                    return {
                        'id' : task.id,
                        'name' : taskNameElement.innerText,
                        'discription' :taskDetailElement.innerText
                    }
                } else return task;
            });
            localStorage.setItem("taskListStored", JSON.stringify(taskList));
            console.log(localStorage.getItem("taskListStored"));
            return;
        }
        taskList.forEach(function(task){
            // for duplicate entries
            if(task.name == taskName.value){
                duplicateEntry = true;
                alert('duplicate entry not allowed.');
                return;
            }
        });
        if(!duplicateEntry){
            populateTasks(taskName.value,taskDetail.value);
        }
        clearPopUpFields(taskName,taskDetail);
    }
    hideMsg(document.getElementById('empty-msg'));
}
function clearPopUpFields(){
    for(let i=0;i<arguments.length;i++){
        arguments[i].value = null;
    }
}
function populateTasks(taskNameValue,taskDetailValue,onReload,id){
    let taskId = onReload ? id:totalTasks;
    let divToBeAppended = '<div class="task"><div class="message-symbol"><i class="fas fa-comments"></i></div><div class="message-discription"><div class="title" id="'+ taskId +'">'+taskNameValue
    +'</div><div class="discription">'+taskDetailValue+'</div><div class="edit-task"><span class="edit"> edit </span> <span class="delete">delete</span></div></div></div>'
    let parentDiv = document.getElementsByClassName("detail")[0];
    let childDiv = document.createElement("div");
    childDiv.innerHTML = divToBeAppended;
    parentDiv.appendChild(childDiv);
    if(!onReload)taskList.push(taskStructure(taskNameValue,taskDetailValue));
    totalTasks++;
    localStorage.setItem("taskListStored", JSON.stringify(taskList));
    // console.log(JSON.parse(localStorage.getItem('taskListStored')));
}
function taskStructure(taskName, taskDetail){
    return {
        'id': String(totalTasks),
        'name' : taskName,
        'discription' : taskDetail
    };
}

function editOrDeleteTask() {
    document.getElementsByClassName("detail")[0].addEventListener('click', function(event){
        let target = event.target;
        var modal = document.getElementById('myModal');
        let taskNameElement = target.parentElement.parentElement.children[0];
        let taskDetailElement = target.parentElement.parentElement.children[1];
        // debugger;
        if(target.className === 'edit' )
        {
          modal.style.display = "block";
          submitButttonListener(taskNameElement,taskDetailElement);
        //   console.log(taskList);
        }
        else if(target.className === 'delete') {
            taskList.forEach(function(task,index){
                if(task.name === taskNameElement.innerText)
                {   let taskContainer = target.parentElement.parentElement.parentElement.parentElement;
                    taskContainer.remove();
                    taskList.splice(index,1);
                    totalTasks--;
                    return;
                }
            });
            console.log(taskList);
            if(taskList.length==0)  showMsg(document.getElementById('empty-msg'),'No Tasks Available');
        }
        localStorage.setItem("taskListStored", JSON.stringify(taskList));
    });
}
