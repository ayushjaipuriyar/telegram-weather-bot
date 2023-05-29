async function unblockuser(id) {
    try {
        const response = await
        fetch(`/users/${id}/blocked`, {
            method: "patch",
            headers: {
                "content-type": "application/json",
            },
            body: json.stringify({
                blocked: false
            }),
        });
        if (!response.ok) {
            throw new error("failed to unblock user");
        }
        getusers();
    } catch (error) {
        console.error(error);
    }
}
async function blockuser(id) {
    try {
        const response = await fetch(`/users/${id}/blocked`, {
            method: "patch",
            headers: {
                "content-type": "application/json",
            },
            body: json.stringify({
                blocked: true
            }),
        });
        if (!response.ok) {
            throw new error("failed to block user");
        }
        getusers();
    } catch (error) {
        console.error(error);
    }
}
async function
deleteuser(id) {
    try {
        const response = await fetch(`/users/${id}`, {
            method: "delete",
            headers: {
                "content-type": "application/json",
            },
        });
        if (!response.ok) {
            throw new error("failed to delete user");
        }
        getusers();
    } catch (error) {
        console.error(error);
    }
}
async function getusers() {
        try {
            const
                response = await fetch("/users", {
                    headers: {
                        "content-type": "application/json",
                    },
                });
            if (!response.ok) {
                throw new error("failed to fetch
                    users "); } const users = await response.json(); displayusers(users); } catch
                    (error) {
                        console.error(error);
                    }
                }

                function displayusers(users) {
                    const
                        usertablebody = document.queryselector(".employees-table-body");
                    usertablebody.innerhtml = "";
                    users.foreach((user) => {
                        const row =
                            document.createelement("tr");
                        row.innerhtml = `
<td>${user.id}</td>
<td>${user.username}</td>
<td>${user.first_name}</td>
<td>${user.last_name}</td>
<td>
    ${ user.blocked ? `<button class="unblock-btn"><i
            class="material-icons"
        >block</i></button>` : `<button class="block-btn"><i
            class="material-icons"
        >unblock</i></button>` }
    <button class="delete-btn"><i class="material-icons">delete</i></button>
</td>
`;
                        usertablebody.appendchild(row);
                    });
                    attacheventlisteners();
                } // attach event
                listeners to dynamically created buttons
                function attacheventlisteners() {
                    const
                        unblockbuttons = document.queryselectorall(".unblock-btn");
                    const blockbuttons =
                        document.queryselectorall(".block-btn");
                    const deletebuttons =
                        document.queryselectorall(".delete-btn");
                    unblockbuttons.foreach((button) => {
                        button.addeventlistener("click", () => {
                            const id =
                                button.parentnode.parentnode.queryselector("td:first-child").textcontent;
                            unblockuser(id);
                        });
                    });
                    blockbuttons.foreach((button) => {
                        button.addeventlistener("click", () => {
                            const id =
                                button.parentnode.parentnode.queryselector("td:first-child").textcontent;
                            blockuser(id);
                        });
                    });
                    deletebuttons.foreach((button) => {
                        button.addeventlistener("click", () => {
                            const id =
                                button.parentnode.parentnode.queryselector("td:first-child").textcontent;
                            deleteuser(id);
                        });
                    });
                } // call getusers initially to populate the table
                getusers();
                attacheventlisteners();