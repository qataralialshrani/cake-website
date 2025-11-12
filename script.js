// تنفيذ التنقل السلس
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const navHeight = document.querySelector('.navbar').offsetHeight;
        
        window.scrollTo({
            top: targetSection.offsetTop - navHeight,
            behavior: 'smooth'
        });
    });
});

// إضافة تأثير التمرير لشريط التنقل
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(139, 69, 19, 0.95)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)';
    }
});

// نظام الحجز والدفع
const bookingForm = document.getElementById('bookingForm');
const paymentStep = document.getElementById('paymentStep');
const ibanDisplay = document.getElementById('ibanDisplay');
const showIbanBtn = document.getElementById('showIban');
const submitBookingBtn = document.getElementById('submitBooking');
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.querySelector('.close');
const newBookingBtn = document.getElementById('newBooking');

// بيانات الآيبان (مخفية بشكل جزئي)
const fullIban = 'SA6305000068206733958000';
const maskedIban = 'SA63 0500 0068 2067 3395 8000';
let isIbanVisible = false;

// تهيئة QR Code
function generateQRCode() {
    const qrElement = document.getElementById('qrcode');
    qrElement.innerHTML = '';
    
    QRCode.toCanvas(qrElement, fullIban, {
        width: 200,
        height: 200,
        colorDark: "#8B4513",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    }, function(error) {
        if (error) {
            console.error(error);
            qrElement.innerHTML = '<p>تعذر إنشاء QR Code</p>';
        }
    });
}

// إظهار/إخفاء رقم الآيبان
showIbanBtn.addEventListener('click', function() {
    isIbanVisible = !isIbanVisible;
    ibanDisplay.textContent = isIbanVisible ? fullIban : maskedIban;
});

// **النموذج المعدل: وظيفة "تابع إلى الدفع"**
// الآن نقوم بإرسال النموذج إلى Formspree أولاً، ثم ننتقل لخطوة الدفع
document.getElementById('submitBookingDetails').addEventListener('click', function(e) {
    e.preventDefault();
    
    const cakeSelect = document.getElementById('cakeSelect');
    const cakeTypeInput = document.getElementById('formCakeType');
    
    if (!cakeSelect.value) {
        alert('الرجاء اختيار نوع الكيك');
        return;
    }
    
    // تحديث القيمة المخفية لنوع الكيك قبل الإرسال
    cakeTypeInput.value = cakeSelect.value;
    
    // إرسال بيانات الحجز إلى Formspree
    document.getElementById('bookingForm').submit();
    
    // إظهار قسم الدفع
    paymentStep.style.display = 'block';
    generateQRCode();
    
    // التمرير إلى قسم الدفع
    paymentStep.scrollIntoView({ behavior: 'smooth' });
});

// **تأكيد الحجز (تم تعديل وظيفته ليصبح مجرد تأكيد بصري)**
submitBookingBtn.addEventListener('click', function() {
    const receiptFile = document.getElementById('paymentReceipt').files[0];
    
    if (!receiptFile) {
        alert('الرجاء رفع إيصال الدفع');
        return;
    }
    
    const customerName = document.getElementById('customerName').value;
    const cakeType = document.getElementById('cakeSelect').value;
    
    // عرض تأكيد الحجز
    document.getElementById('confirmationMessage').textContent = 
        `شكراً ${customerName}! تم استلام حجزك لـ ${cakeType}. سنتواصل معك خلال 24 ساعة. (إيصال الدفع يتم حفظه لديك حاليًا)`;
    
    bookingModal.style.display = 'block';
});

// إغلاق المودال
closeModal.addEventListener('click', function() {
    bookingModal.style.display = 'none';
});

newBookingBtn.addEventListener('click', function() {
    bookingModal.style.display = 'none';
    // إعادة تعيين النماذج
    bookingForm.reset();
    document.getElementById('cakeSelect').value = '';
    document.getElementById('paymentReceipt').value = '';
    paymentStep.style.display = 'none';
    
    // العودة إلى أعلى قسم الحجز
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
});

// إغلاق المودال بالنقر خارج المحتوى
window.addEventListener('click', function(e) {
    if (e.target === bookingModal) {
        bookingModal.style.display = 'none';
    }
});

// **نموذج التواصل (تم إلغاء وظيفة التنبيه المحلية)**
// الآن يتم إرساله مباشرة عبر Formspree
// document.getElementById('messageForm').addEventListener('submit', function(e) { e.preventDefault(); alert('...'); this.reset(); });


// تفعيل اختيار الكيك من البطاقات
document.querySelectorAll('.cake-card').forEach(card => {
    card.addEventListener('click', function() {
        const cakeName = this.getAttribute('data-cake');
        const cakePrice = this.getAttribute('data-price');
        const select = document.getElementById('cakeSelect');
        const optionText = `${cakeName} - ${cakePrice} ريال`;
        
        // البحث عن الخيار المناسب
        for (let option of select.options) {
            if (option.text === optionText) {
                option.selected = true;
                break;
            }
        }
        
        // التمرير إلى قسم الحجز
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });
});
