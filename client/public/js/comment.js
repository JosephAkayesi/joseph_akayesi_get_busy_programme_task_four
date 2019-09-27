function initializeLocalStorage() {
    if (!isLocalStorageSet()) setLocalStorage()
}

function isLocalStorageSet() {
    return localStorage.hasOwnProperty('TaskFourPostsComments')
}

function setLocalStorage() {
    localStorage.setItem('TaskFourPostsComments', JSON.stringify([]))
}

function getPostComments() {
    let postsComments = []
    let postId = document.getElementById('postId') ? document.getElementById('postId').innerText : null
    let posts = getLocalStorageItem()

    if (!postId) {
        return
    }

    posts.forEach(post => {
        if (post.id === postId) {
            postsComments = post.comments
        }
    })

    showComments(postsComments, postId)
}

function getLocalStorageItem() {
    return JSON.parse(localStorage.getItem('TaskFourPostsComments'))
}

function showComments(comments, postId) {
    let showComments = document.getElementById('showComments')
    let commentsList = createCommentsList(comments, postId)
    showComments.innerHTML = commentsList.join("")
}

function createCommentsList(comments, postId) {
    let commentsList = []
    comments.forEach((comment, index) => {
        let listItems = `<li class="list-group-item">
            <div class="row">
                <div class="col-8 align-middle" style='font-family: CircularStd-Book; font-weight: 600;'>
                    Username</div>
                <div class="col-4 text-right">
                    <img class="delete" src='/images/trash-2.svg' alt="Smiley face" style="width: 15px; height: 15px" onclick="deleteComment(event)" id="${postId}_${index}">
                </div>
            </div>
            <div class="row comment">
                <div class="col">
                    <p style='font-family: CircularStd-Book;'>${comment}
                    </p>
                </div>
            </div>
            </li>`


        commentsList.push(listItems)
    })

    return commentsList
}

function getPostTotalComments() {
    let postTotalComments = document.getElementsByClassName('postTotalComments')
    let posts = getLocalStorageItem()

    for (let post of postTotalComments) {
        let postLabel = post.id
        let postId = post.id.slice(6)

        appendTotalCommentsToPost(postLabel, postId, posts)
    }
}

function appendTotalCommentsToPost(postLabel, postId, posts) {
    let currentLabel = document.getElementById(postLabel)
    let count = 0
    posts.forEach(post => {
        if (post.id === postId) {
            count = post.comments.length
        }
    })

    currentLabel.innerText = count !== 0 ? count : null
}

function getTotalComments() {
    let postId = document.getElementById('postId') ? document.getElementById('postId').innerText : null
    let posts = getLocalStorageItem()
    let count = 0

    if (!postId) {
        return
    }

    posts.forEach(post => {
        if (post.id === postId) {
            count = post.comments.length
        }
    })

    let totalComments = document.getElementById('totalComments')
    totalComments.innerText = count
}

function getNewComment() {
    let postId = document.getElementById('postId').innerText
    let comment = document.getElementById('postComment').value

    return { postId, comment }
}

function saveComment() {
    let posts = getLocalStorageItem()
    const { postId, comment } = getNewComment()

    if (comment.trim() === "") {
        return alert('Cannot enter an empty string')
    }

    if (posts.length !== 0 && posts.find(post => post.id === postId)) {
        posts.forEach(post => {
            if (post.id === postId) {
                post.comments.push(comment)
                setLocalStorageItem(posts)
            }
        })
    }
    else {
        let newPostComment = {
            id: postId,
            comments: [comment]
        }

        posts.push(newPostComment)
        setLocalStorageItem(posts)
    }

    reload()
}

function setLocalStorageItem(posts) {
    localStorage.setItem('TaskFourPostsComments', JSON.stringify(posts))
}

function reload() {
    window.location.reload()
}

async function deleteComment(event) {
    event.preventDefault()
    const [postId, comment] = event.target.id.split('_')

    let posts = getLocalStorageItem()
    await posts.forEach(async (post) => {
        if (post.id === postId) {
            await post.comments.splice(comment, 1)
        }
    })

    setLocalStorageItem(posts)
    reload()
}

function showComment(comment) {
    let li = document.createElement('li')
    let div1 = document.createElement('div')
    let div2 = document.createElement('div')
    let p = document.createElement('p')
    li.classList.add('list-group-item')
    div1.classList.add('row')
    div1.classList.add('comment')
    div2.classList.add('col')
    p.setAttribute('style', 'font-family: CircularStd-Book;')

    li.appendChild(div1)
    li.appendChild(div2)
    li.appendChild(p)
    li.lastChild.innerHTML = comment
    return li
}

initializeLocalStorage()
getPostComments()
getPostTotalComments()
getTotalComments()

