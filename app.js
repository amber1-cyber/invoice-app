// 🔴 FIXED URL (IMPORTANT)
const supabaseClient = supabase.createClient(
  "https://hpbrbuoafvcmrfksxyke.supabase.co",
  "sb_publishable_mUvl_qlZhXIUiAW1ZX6hBg_1iXwsfj4"
);

// LOAD CLIENTS
async function loadClients() {
  const { data } = await supabaseClient.from("clients").select("*");

  const dropdown = document.getElementById("clientSelect");
  dropdown.innerHTML = "";

  data.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
    opt.textContent = c.name;
    dropdown.appendChild(opt);
  });
}

// ADD CLIENT
async function addClient() {
  const name = document.getElementById("newClient").value;

  if (!name) return;

  await supabaseClient.from("clients").insert([{ name }]);

  document.getElementById("newClient").value = "";
  loadClients();
}

// STOCK
let stockData = [];

async function loadStock() {
  const { data } = await supabaseClient.from("stock").select("*");
  stockData = data;
}

async function addStock() {
  const name = stockName.value;
  const price = parseFloat(stockPrice.value);

  if (!name || !price) return;

  await supabaseClient.from("stock").insert([{ name, price }]);

  stockName.value = "";
  stockPrice.value = "";

  loadStock();
}

// ITEMS
let count = 0;

function addItem() {
  const div = document.createElement("div");

  div.innerHTML = `
    <b>Line ${count + 1}</b>
    <select id="item${count}" onchange="autoPrice(${count})"></select>
    <input id="qty${count}" type="number" placeholder="Qty">
    <input id="price${count}" type="number" placeholder="Price">
  `;

  items.appendChild(div);

  const select = document.getElementById(`item${count}`);
  stockData.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.name;
    opt.textContent = s.name;
    select.appendChild(opt);
  });

  count++;
}

function autoPrice(i) {
  const name = document.getElementById(`item${i}`).value;
  const item = stockData.find(s => s.name === name);

  if (item) {
    document.getElementById(`price${i}`).value = item.price;
  }
}

// FORMAT
function money(v) {
  return Number(v).toLocaleString("en-ZA", { minimumFractionDigits: 2 });
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// GENERATE
function generate() {
  invoice.style.display = "block";

  outClient.innerText = clientSelect.value;
  outShip.innerText = ship.value;
  outNum.innerText = num.value;
  outDate.innerText = formatDate(date.value);

  table.innerHTML = `
    <tr>
      <th>Items</th><th>Qty</th><th>Price</th><th>Amount</th>
    </tr>
  `;

  let total = 0;

  for (let i = 0; i < count; i++) {
    const desc = document.getElementById(`item${i}`).value;
    const qty = +document.getElementById(`qty${i}`).value || 0;
    const price = +document.getElementById(`price${i}`).value || 0;

    const amount = qty * price;
    total += amount;

    table.innerHTML += `
      <tr>
        <td>${desc}</td>
        <td>${qty}</td>
        <td>R${money(price)}</td>
        <td>R${money(amount)}</td>
      </tr>
    `;
  }

  topTotal.innerText = money(total);
  bottomTotal.innerText = money(total);
  bottomTotal2.innerText = money(total);
}

// PRINT
function printInvoice() {
  window.print();
}

// INIT
loadClients();
loadStock();
addItem();