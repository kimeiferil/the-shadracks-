import { fetchWithAuth } from './api.js';

// DOM Elements
const elements = {
    photoGrid: document.getElementById('photo-grid'),
    uploadModal: document.getElementById('upload-modal'),
    uploadForm: document.getElementById('photo-upload-form'),
    fileInput: document.getElementById('file-input'),
    dropZone: document.getElementById('drop-zone'),
    uploadBtn: document.getElementById('upload-btn'),
    progressBar: document.getElementById('upload-progress'),
    progressText: document.getElementById('progress-text'),
    albumSelect: document.getElementById('album-select'),
    albumFilter: document.getElementById('album-filter'),
    photoSearch: document.getElementById('photo-search'),
    pagination: document.getElementById('pagination'),
    addPhotosBtn: document.getElementById('add-photos-btn')
};

// State
let currentPage = 1;
const limit = 20;
let selectedFiles = [];
let albums = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadAlbums();
    await loadPhotos();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Upload modal
    elements.addPhotosBtn.addEventListener('click', openUploadModal);
    elements.uploadModal.querySelector('.modal-close').addEventListener('click', closeUploadModal);
    elements.uploadModal.querySelector('.modal-close-btn').addEventListener('click', closeUploadModal);
    
    // File selection
    elements.dropZone.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    elements.dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.dropZone.classList.add('drag-over');
    });
    
    elements.dropZone.addEventListener('dragleave', () => {
        elements.dropZone.classList.remove('drag-over');
    });
    
    elements.dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            elements.fileInput.files = e.dataTransfer.files;
            handleFileSelect({ target: elements.fileInput });
        }
    });
    
    // Form submission
    elements.uploadForm.addEventListener('submit', handleUploadSubmit);
    
    // Search and filter
    elements.photoSearch.addEventListener('input', debounce(loadPhotos, 300));
    elements.albumFilter.addEventListener('change', loadPhotos);
    
    // Pagination
    elements.pagination.addEventListener('click', handlePaginationClick);
}

// Load photos
async function loadPhotos() {
    try {
        const search = elements.photoSearch.value;
        const albumId = elements.albumFilter.value;
        
        const params = new URLSearchParams({
            page: currentPage,
            limit,
            ...(albumId && { albumId }),
            ...(search && { search })
        });
        
        const response = await fetchWithAuth(`/api/gallery/photos?${params}`);
        const { data, pagination } = await response.json();
        
        renderPhotos(data);
        renderPagination(pagination);
    } catch (error) {
        console.error('Failed to load photos:', error);
        showAlert('error', 'Failed to load photos');
    }
}

// Load albums
async function loadAlbums() {
    try {
        const response = await fetchWithAuth('/api/gallery/albums');
        const { data } = await response.json();
        albums = data;
        renderAlbumOptions();
    } catch (error) {
        console.error('Failed to load albums:', error);
        showAlert('error', 'Failed to load albums');
    }
}

// Render photos
function renderPhotos(photos) {
    elements.photoGrid.innerHTML = photos.map(photo => `
        <div class="photo-card" data-id="${photo._id}">
            <div class="photo-thumbnail">
                <img src="${photo.path}" alt="${photo.caption || 'Family photo'}" loading="lazy">
                <div class="photo-overlay">
                    <button class="btn-icon photo-view" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon photo-edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon photo-delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <input type="checkbox" class="photo-select" id="select-${photo._id}">
                <label for="select-${photo._id}" class="photo-select-label"></label>
            </div>
            <div class="photo-info">
                <p class="photo-caption">${photo.caption || 'No caption'}</p>
                <p class="photo-meta">
                    <span class="photo-album">${photo.album?.name || 'No album'}</span>
                    <span class="photo-date">${new Date(photo.createdAt).toLocaleDateString()}</span>
                </p>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to photo actions
    document.querySelectorAll('.photo-delete').forEach(btn => {
        btn.addEventListener('click', handleDeletePhoto);
    });
    
    document.querySelectorAll('.photo-edit').forEach(btn => {
        btn.addEventListener('click', handleEditPhoto);
    });
    
    document.querySelectorAll('.photo-view').forEach(btn => {
        btn.addEventListener('click', handleViewPhoto);
    });
}

// Handle file selection
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const validSize = file.size <= 10 * 1024 * 1024; // 10MB
        return validTypes.includes(file.type) && validSize;
    });
    
    if (files.length !== validFiles.length) {
        showAlert('warning', 'Some files were invalid. Only JPG/PNG/WEBP under 10MB are allowed.');
    }
    
    selectedFiles = validFiles;
    elements.uploadBtn.disabled = selectedFiles.length === 0;
    
    if (selectedFiles.length > 0) {
        elements.uploadBtn.innerHTML = `<i class="fas fa-upload"></i> Upload ${selectedFiles.length} Photo${selectedFiles.length > 1 ? 's' : ''}`;
    }
}

// Handle upload
async function handleUploadSubmit(event) {
    event.preventDefault();
    
    if (selectedFiles.length === 0) return;
    
    const formData = new FormData();
    selectedFiles.forEach(file => {
        formData.append('photos', file);
    });
    
    if (elements.albumSelect.value) {
        formData.append('albumId', elements.albumSelect.value);
    }
    
    if (elements.uploadForm.querySelector('#photo-caption').value) {
        formData.append('caption', elements.uploadForm.querySelector('#photo-caption').value);
    }
    
    try {
        elements.uploadBtn.disabled = true;
        elements.uploadForm.querySelector('.upload-progress').classList.remove('hidden');
        
        const response = await fetchWithAuth('/api/gallery/upload', {
            method: 'POST',
            body: formData,
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                elements.progressBar.style.width = `${percentCompleted}%`;
                elements.progressText.textContent = `${percentCompleted}%`;
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('success', result.message);
            closeUploadModal();
            await loadPhotos();
        } else {
            throw new Error(result.error || 'Upload failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showAlert('error', error.message || 'Failed to upload photos');
    } finally {
        resetUploadForm();
    }
}

// Helper functions
function openUploadModal() {
    elements.uploadModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeUploadModal() {
    elements.uploadModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
}

function resetUploadForm() {
    elements.uploadForm.reset();
    elements.fileInput.value = '';
    elements.progressBar.style.width = '0%';
    elements.progressText.textContent = '0%';
    elements.uploadForm.querySelector('.upload-progress').classList.add('hidden');
    elements.uploadBtn.disabled = true;
    elements.uploadBtn.innerHTML = `<i class="fas fa-upload"></i> Upload Photos`;
    selectedFiles = [];
}

function renderAlbumOptions() {
    const options = albums.map(album => `
        <option value="${album._id}">${album.name}</option>
    `).join('');
    
    elements.albumSelect.innerHTML = `
        <option value="">-- Select Album --</option>
        ${options}
    `;
    
    elements.albumFilter.innerHTML = `
        <option value="">All Albums</option>
        ${options}
    `;
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Export for testing
export { setupEventListeners, loadPhotos, loadAlbums };
