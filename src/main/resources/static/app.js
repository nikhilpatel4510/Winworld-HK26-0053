const body = document.getElementById('patients');
const dlg = document.getElementById('dlg');
const form = document.getElementById('patientForm');

let editingPatientId = null;


// ==================== API FUNCTION ====================

async function api(url, opt = {}) {
    const r = await fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        },
        ...opt
    });

    if (!r.ok) {
        let m = `Request failed (${r.status})`;

        try {
            const j = await r.json();
            m = j.detail || j.message || j.error || m;
        } catch (e) {
            // Keep the default error message
        }

        throw Error(m);
    }

    return r.status === 204 ? null : r.json();
}


// ==================== HTML ESCAPE FUNCTION ====================

function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[c]));
}


// ==================== TOAST MESSAGE ====================

function toast(t) {
    const e = document.getElementById('toast');

    e.textContent = t;
    e.style.display = 'block';

    setTimeout(() => {
        e.style.display = 'none';
    }, 2600);
}


// ==================== LOAD PATIENTS ====================

async function load() {

    body.innerHTML = `
        <tr>
            <td colspan="7">Loading...</td>
        </tr>
    `;

    try {

        const ps = await api('/api/patients');

        const normalCount = ps.filter(
            p => p.monitoringStatus === 'NORMAL'
        ).length;

        document.getElementById('total').textContent = ps.length;

        document.getElementById('normal').textContent = normalCount;

        document.getElementById('review').textContent =
            ps.length - normalCount;


        if (!ps.length) {

            body.innerHTML = `
                <tr>
                    <td colspan="7">
                        No patients yet. Add a demo record.
                    </td>
                </tr>
            `;

            return;
        }


        body.innerHTML = ps.map(p => `
            <tr>

                <td>
                    <b>${esc(p.name)}</b>
                    <br>
                    <small>ID ${esc(p.patientId)}</small>
                </td>

                <td>
                    ${esc(p.age)}
                </td>

                <td>
                    ${esc(p.heartRate)} bpm
                </td>

                <td>
                    ${esc(p.bloodPressure)}
                </td>

                <td>
                    ${Number(p.oxygenLevel).toFixed(1)}%
                </td>

                <td>
                    <span class="pill ${
                        p.monitoringStatus === 'NORMAL'
                            ? 'normal'
                            : 'review'
                    }">
                        ${
                            p.monitoringStatus === 'NORMAL'
                                ? 'NORMAL'
                                : 'REVIEW REQUIRED'
                        }
                    </span>
                </td>

                <td>
                    <button
                        class="edit"
                        data-edit-id="${esc(p.patientId)}">
                        Edit
                    </button>

                    <button
                        class="delete"
                        data-id="${esc(p.patientId)}">
                        Delete
                    </button>
                </td>

            </tr>
        `).join('');


    } catch (e) {

        body.innerHTML = `
            <tr>
                <td colspan="7">
                    Could not load data: ${esc(e.message)}
                </td>
            </tr>
        `;
    }
}


// ==================== REFRESH DASHBOARD ====================

document.getElementById('refreshBtn').onclick = load;


// ==================== ADD PATIENT BUTTON ====================

document.getElementById('addBtn').onclick = () => {

    editingPatientId = null;

    form.reset();

    document.getElementById('err').textContent = '';

    const saveBtn = form.querySelector('[type="submit"]');

    if (saveBtn) {
        saveBtn.textContent = 'Save Patient';
    }

    dlg.showModal();
};


// ==================== CLOSE FORM ====================

document.getElementById('closeBtn').onclick = () => {

    dlg.close();

    editingPatientId = null;

};


// ==================== EDIT AND DELETE PATIENT ====================

body.onclick = async (e) => {


    // ---------- EDIT PATIENT ----------

    const editBtn = e.target.closest('[data-edit-id]');

    if (editBtn) {

        try {

            const id = editBtn.dataset.editId;

            // Fetch existing patient details
            const p = await api('/api/patients/' + id);

            editingPatientId = id;

            form.reset();

            document.getElementById('err').textContent = '';


            // Fill existing details in the form
            const fields = [
                'name',
                'age',
                'heartRate',
                'bloodPressure',
                'oxygenLevel'
            ];

            fields.forEach(key => {

                const input = form.elements.namedItem(key);

                if (input) {
                    input.value = p[key] ?? '';
                }

            });


            // Change button text
            const saveBtn = form.querySelector('[type="submit"]');

            if (saveBtn) {
                saveBtn.textContent = 'Update Patient';
            }


            // Open the form
            dlg.showModal();


        } catch (err) {

            toast(err.message);

        }

        return;
    }



    // ---------- DELETE PATIENT ----------

    const deleteBtn = e.target.closest('[data-id]');

    if (!deleteBtn) {
        return;
    }

    if (!confirm('Are you sure you want to delete this patient?')) {
        return;
    }


    try {

        await api('/api/patients/' + deleteBtn.dataset.id, {
            method: 'DELETE'
        });

        toast('Patient deleted successfully');

        await load();


    } catch (err) {

        toast(err.message);

    }

};


// ==================== SAVE OR UPDATE PATIENT ====================

form.onsubmit = async (e) => {

    e.preventDefault();


    // Get form data
    const d = Object.fromEntries(
        new FormData(form)
    );


    // Convert numeric values
    ['age', 'heartRate', 'oxygenLevel'].forEach(key => {
        d[key] = Number(d[key]);
    });


    try {

        if (editingPatientId !== null) {


            // ---------- UPDATE EXISTING PATIENT ----------

            await api('/api/patients/' + editingPatientId, {
                method: 'PUT',
                body: JSON.stringify(d)
            });

            toast('Patient updated successfully');


        } else {


            // ---------- ADD NEW PATIENT ----------

            await api('/api/patients', {
                method: 'POST',
                body: JSON.stringify(d)
            });

            toast('Patient saved successfully');

        }


        // Close form
        dlg.close();

        editingPatientId = null;

        form.reset();


        // Restore button text
        const saveBtn = form.querySelector('[type="submit"]');

        if (saveBtn) {
            saveBtn.textContent = 'Save Patient';
        }


        // Refresh dashboard
        await load();


    } catch (err) {

        document.getElementById('err').textContent = err.message;

    }

};


// ==================== INITIALIZE DASHBOARD ====================

load();