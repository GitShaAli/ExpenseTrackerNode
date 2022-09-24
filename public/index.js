
window.addEventListener('DOMContentLoaded',async()=>{
    let range;
    if(localStorage.getItem('screenRange')===null){
        range=5;
    }
    else{   
        range = localStorage.getItem('screenRange');
        document.getElementById('perPage').placeholder=range;
    }
    axios.post(`http://3.80.105.110:3000/expense/allexpenses/pagePerView/?pageLimit=${range}`);
    
    const btn = document.getElementById('load').classList;
    if(btn.contains("loader")){
        btn.remove("loader");
    }
    const token=  localStorage.getItem('token');
    try {
        const userType =await axios.get(`http://3.80.105.110:3000/userType/member/`,{headers:{"Authorization":token}})
        const premiumMember = userType.data.data[0].ispremiumuser;
        if(premiumMember){
            console.log("hi")
            document.body.style.backgroundImage = "radial-gradient(#858a88,#000604)";
            // document.getElementById('head').style.color="white";
            // document.getElementById('container').style.backgroundColor="#184033";
            // document.getElementById('lister').style.backgroundColor="#184033";
            // document.getElementById("container").style.boxShadow = "10px 10px 400px #7de0bf" leaderDiv
            document.getElementById('leaderDiv').style.display="block";
            document.getElementById('rzp-button1').remove();
            // document.getElementById('leader').style.display="block";
            document.getElementById('downloadexpense').style.display="block";
            const AllExpense =await axios.get(`http://3.80.105.110:3000/expense/allUserexpenses/`,{headers:{"Authorization":token}})

            console.log(AllExpense.data.data.length)
            for (var i = 0; i < AllExpense.data.data.length; i++) { 
                leaderboard(AllExpense.data.data[i],i);
            }

            const AllDownloads = await axios.get(`http://3.80.105.110:3000/expense/allDownloads/`,{headers:{"Authorization":token}})
            for (var i = 0; i < AllDownloads.data.data.length; i++) { 
                downloadDisplay(AllDownloads.data.data[i],i);
            }


        }

        const pageNumber = 1;
        const load =await axios.get(`http://3.80.105.110:3000/expense/allexpenses/?page=${pageNumber}`,{headers:{"Authorization":token}})
        for (var i = 0; i < load.data.data.length; i++) { 
            showNewExpenseOnScreen(load.data.data[i]);
        }
        console.log("Load",load.data)
            const lastPage=load.data.lastPage;
            let pageParent = document.getElementById('pagination');
            for(let i=2;i<=lastPage;i++){
                const pP = document.createElement("button");
                pP.classList.add('pButton');
                pP.innerText = i;
                pageParent.appendChild(pP);
            }

        const income =await axios.get(`http://3.80.105.110:3000/income/allincome/`,{headers:{"Authorization":token}})
        console.log(income.data.data.length)
        for (var i = 0; i < income.data.data.length; i++) { 
            showNewIncomeOnScreen(income.data.data[i]);
        }
          
    } catch (error) {
        if(error=='Error: Request failed with status code 401'){
            window.location.href = "login.html";
        }
        document.body.innerHTML=document.body.innerHTML+'Something went wrong.'+error;
    }
})

const logout = document.getElementById('logout');
logout.addEventListener('click',async(e)=>{
    console.log("logout")
    // class="setRange"
    if(e.target.className=='logout'){
        console.log("logout")
        localStorage.removeItem('token');
        window.location.href ="http://3.80.105.110:3000/login.html";
    }

});


const parentContainer = document.getElementById('pagination');
parentContainer.addEventListener('click',async(e)=>{

    // class="setRange"
    if(e.target.className=='logout'){
        localStorage.removeItem('token');
        window.location.href ="http://3.80.105.110:3000/login.html";
    }

    if(e.target.className=='setRange'){
        const pageRange = document.getElementById('perPage').value;
        localStorage.setItem('screenRange',pageRange)
        location.reload();
        // const setPage = await axios.post(`http://3.80.105.110:3000/expense/allexpenses/pagePerView/?pageLimit=${pageRange}`);
        // if(setPage.status==200){
        //     localStorage.setItem('screenRange',pageRange)
        //     location.reload();
        // }
        
    }
    if(e.target.className=='pButton'){
        const token=  localStorage.getItem('token');
        const tableRow = Array.from(document.getElementsByClassName('removableRow'));
            tableRow.forEach(row => {        
            row.remove();
        });
        const elements = Array.from(document.getElementsByClassName('active'));

            elements.forEach(element => {
            element.classList.remove('active');
        });
        // const token=  localStorage.getItem('token');
        const pageNumber = e.target.innerHTML;
        e.target.classList.add('active');
        const load = await axios.get(`http://3.80.105.110:3000/expense/allexpenses/?page=${pageNumber}`,{headers:{"Authorization":token}})
        for (var i = 0; i < load.data.data.length; i++) { 
            showNewExpenseOnScreen(load.data.data[i]);
        }
        
    }
})
async function download(){
    const token=  localStorage.getItem('token');
    const btn = document.getElementById('load').classList;

    btn.add('loader');
    console.log("download in")
    await axios.get('http://3.80.105.110:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
                var a = document.createElement("a");
                a.href = response.data.fileUrl;
                a.download = 'myexpense.csv';
                a.click();
                downloadDisplay(response.data.down);

        } else {
            throw new Error(response.data.message)
        }
    })
    .catch((err) => {
        console.log(error)
    });
}

async function leaderboard(Expense,i){
    const userName = await axios.get(`http://3.80.105.110:3000/user/getUserName/?id=${Expense.userId}`)
    const parentNode = document.getElementById("leader");
    const childNode = `<tr class="item" id=${Expense.id}>
                        <td>
                        ${i+1}
                        </td>
                        <td>
                        ${userName.data[0].name}
                        </td>
                        <td>
                        <b>₹,${Expense.total}</b>
                        </td>
                        <td>
                        <button class="normalButton" onclick=showUserExpense('${Expense.userId}','${userName.data[0].name}')> View All</button>
                        </td> 
                        </tr>`
    parentNode.innerHTML = parentNode.innerHTML+childNode;
}

async function addExpense(e){

    try {
        e.preventDefault();
        const token=  localStorage.getItem('token');
        console.log("token is : "+token)
        const headers = {
            'Authorization': token
        }
        // const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const category = document.getElementById('category').value;
        const res = await axios.post(`http://3.80.105.110:3000/expense/addexpense/`,{description,price,category},{headers:headers})
        if(res.status==201){
            notification(res.data.message);
            location.reload();
            // showNewExpenseOnScreen(res.data.data)
            // console.log(res.data)
        }
        else{
            throw new Error("Failed to Add");
        }
    } catch (error) {
        notification(error);
    }
}


async function addIncome(e){

    try {
        e.preventDefault();
        const token=  localStorage.getItem('token');
        console.log("token is : "+token)
        const headers = {
            'Authorization': token
        }
        // const title = document.getElementById('title').value;
        const description = document.getElementById('Sdescription').value;
        const price = document.getElementById('Sprice').value;
        console.log('p:',price);
        console.log('d:',description)
        const res = await axios.post(`http://3.80.105.110:3000/income/addincome/`,{description,price},{headers:headers})
        if(res.status==201){
            notification(res.data.message);
            showNewIncomeOnScreen(res.data.data);
            console.log(res.data)
        }
        else{
            throw new Error("Failed to Add");
        }
    } catch (error) {
        notification(error);
    }
}




async function deleteExpense(id){
    console.log('deleting.....',id)
    try {
        const token=  localStorage.getItem('token');
        const headers = {
            'Authorization': token
        }
        const res = await axios.post(`http://3.80.105.110:3000/expense/deleteExpense/`,{id},{headers:headers})
        if(res.status==201){
            removeExpenseFromScreen(id);
            notification(res.data.message);
            console.log(`Expense Deleted `)
        }
    } catch (error) {
        document.body.innerHTML=document.body.innerHTML+'Something went wrong.'
        console.log(error)
    }
}

function closeWindow(){
    console.log("in")
    document.getElementById('u').style.display = "none";
}
async function showUserExpense(userid,username){
    try{
        document.getElementById('u').style.display="block";
        console.log('-------------------------------------',username)
        const res = await axios.get(`http://3.80.105.110:3000/expense/allUserExpenseShower/?userId=${userid}`,{id:userid})
        const otherUser = document.getElementById("otherUser");
        if(otherUser){
            otherUser.remove();
            const u =document.getElementById("u");
            const parentNode =  document.createElement("table");
            parentNode.setAttribute("id", "otherUser");
            u.appendChild(parentNode);
            // const para = document.createElement("h4");
            const childTH = `<th colspan="3">${username}</th>`
            // parentNode.appendChild(para);
            parentNode.innerHTML = parentNode.innerHTML+childTH;
            for (var i = 0; i < res.data.data.length; i++) { 
                display(res.data.data[i],username);
            }
        }else{
            const u =document.getElementById("u");
            const parentNode =  document.createElement("table");
            parentNode.setAttribute("id", "otherUser");
            u.appendChild(parentNode);
            // const para = document.createElement("h4");
            const childTH = `<th colspan="3">${username}</th>`
            // parentNode.appendChild(para);
            parentNode.innerHTML = parentNode.innerHTML+childTH;
            for (var i = 0; i < res.data.data.length; i++) { 
                display(res.data.data[i],username);
            }
        }
        // for (var i = 0; i < res.data.data.length; i++) { 
        //     display(res.data.data[i]);
        // }
    }catch(err){
        console.log(err);
    }
}
function display(Expense,username){


    const parentNode =  document.getElementById("otherUser");
    const childNode = `
                        <tr class="item" id=${Expense.id}>
                        <td>
                        <b>₹,${Expense.price}</b>
                        </td>
                        <td>
                            Description:
                            ${Expense.description}
                        </td>
                        <td>
                        <b>${Expense.category}</b>
                        </td>
                        </tr>`
    parentNode.innerHTML = parentNode.innerHTML+childNode;
}
function downloadDisplay(Download){


    const parentNode =  document.getElementById("showDowns");
    const childNode = `
                        <tr class="item" id=${Download.id}>
                        <td>
                        <a href="${Download.url}">Click here to see</a>
                        </td>
                        <td>
                        <b>Downloaded At : ${(new Date(Download.createdAt)).toLocaleDateString()}</b>
                        </td>
                        </tr>`
    parentNode.innerHTML = parentNode.innerHTML+childNode;
}



function showNewExpenseOnScreen(Expense){
    const parentNode = document.getElementById("lStrorage");
    // let remElements = document.createElement("table");
    // remElements.setAttribute("id", "showAll");
    // parentNode.appendChild(remElements)
    const childNode = `<tr id=${Expense.id} class="removableRow">
                        

                           <td> Description : 
                            <b>${Expense.description}</b></td>

                        <td> Category : 
                        <b>${Expense.category}</b></td>



                        <td> Price : 
                            <b>₹,${Expense.price}</b></td>
  

                        <td> <button class='ebtn normalButton' onclick=deleteExpense('${Expense.id}')> Delete</button></td>

                        </tr>`
                        parentNode.innerHTML+=childNode;
                        // remElements.innerHTML += childNode;   
    reset();
    // <button class='ebtn'  onclick=editExpense('${Expense.id}','${Expense.amnt}','${Expense.description}','${Expense.category}')> Edit </button>
    
}


function showNewIncomeOnScreen(Expense){
    const parentNode = document.getElementById("Income");
    const childNode = `<tr id=${Expense.id}>
                        

                           <td> Description : 
                            <b>${Expense.description}</b></td>

                        <td>Price : 
                            <b>₹,${Expense.price}</b></td>


                        </tr>`
    parentNode.innerHTML = parentNode.innerHTML+childNode;   
    
    // <button class='ebtn'  onclick=editExpense('${Expense.id}','${Expense.amnt}','${Expense.description}','${Expense.category}')> Edit </button>
    
}

function removeExpenseFromScreen(em){
    const parentNode = document.getElementById('lStrorage');
    const childnode = document.getElementById(em);
    
    if(childnode){
        childnode.remove();
        // parentNode.removeChild(childnode);
    }
}

function reset(){
    document.getElementById('description').value=""
    document.getElementById('price').value=""
    document.getElementById('category').value=""
}

function notification(res){
    const container = document.getElementById('notification-container');
    const notif = document.createElement('div');
    notif.classList.add('toast');
    notif.innerHTML = `<h3><strong style="color:red;padding: 20px;">${res}</strong><h3>`;
    container.appendChild(notif);

    setTimeout(()=>{
        notif.remove();
    },4000)
}

document.getElementById('rzp-button1').onclick = async function (e) {
    const token=  localStorage.getItem('token');
    const headers = {
        'Authorization': token
    }
    const response  = await axios.get('http://3.80.105.110:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id,
     "name": "Expense Tracker Premium MemberShip",
     "order_id": response.data.order.id,
     "prefill": {
       "name": "user",
       "email": "user@example.com",
       "contact": "9999999999"
     },
     "theme": {
      "color": "#a9dcdf"
     },
    
     "handler": function (response) {
         console.log(response);
         axios.post('http://3.80.105.110:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} }).then(() => {
             alert('Your Premium MemeberShip is Active')
             window.location.reload(); 
         }).catch(() => {
             alert('Something went wrong. Try Again!!!')
         })
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
  alert(response.error.code);
  alert(response.error.description);
  alert(response.error.source);
  alert(response.error.step);
  alert(response.error.reason);
  alert(response.error.metadata.order_id);
  alert(response.error.metadata.payment_id);
 });
}