// =================== Extension Resizing =================== \\
export function startExtResize(event) {
    this.isResizing = true;
    this.initialWidth = this.$refs.draggableExtDiv.offsetWidth;
    this.initialX = event.clientX;
    document.addEventListener('mousemove', this.resizeExt);
    document.addEventListener('mouseup', this.stopExtResize);
}

export function resizeExt(event) {
    if(this.isResizing) {
        const newWidth = this.initialWidth + (event.clientX - this.initialX);
        // let draggableExtDivWidth = this.$refs.draggableExtDiv.style.width;
        this.$refs.draggableExtDiv.style.width = `${newWidth}px`;
        if(this.$refs.extensionDivs) {
            this.$refs.extensionDivs.forEach(div => {
                div.style.width = `${newWidth}px`;
            });
        }
    }
}

export function stopExtResize() {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.resizeExt);
    document.removeEventListener('mouseup', this.stopExtResize);
}

// =================== Model Resizing =================== \\
export function startModelResize(event) {
    this.isResizing = true;
    this.initialWidth = this.$refs.draggableModelDiv.offsetWidth;
    this.initialX = event.clientX;
    document.addEventListener('mousemove', this.resizeModel);
    document.addEventListener('mouseup', this.stopModelResize);
}

export function resizeModel(event) {
    if(this.isResizing) {
        const newWidth = this.initialWidth + (event.clientX - this.initialX);
        this.$refs.draggableModelDiv.style.width = `${newWidth}px`;
        if(this.$refs.modelDivs) {
            this.$refs.modelDivs.forEach(div => {
                div.style.width = `${newWidth}px`;
            });
        }
    }
}

export function stopModelResize() {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.resizeModel);
    document.removeEventListener('mouseup', this.stopModelResize);
}

// =================== Sidebar Resizing =================== \\
export function startResize(event) {
    this.isResizing = true;
    this.initialWidth = this.$refs.draggableDiv.offsetWidth;
    this.initialX = event.clientX;
    document.addEventListener('mousemove', this.resize);
    document.addEventListener('mouseup', this.stopResize);
}

export function resize(event) {
    if(this.isResizing) {
        const newWidth = this.initialWidth + (event.clientX - this.initialX);
        this.$refs.draggableDiv.style.width = `${newWidth}px`;
        this.currentSideBarWidth = this.$refs.draggableDiv.style.width;
    }
}

export function stopResize() {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.resize);
    document.removeEventListener('mouseup', this.stopResize);
}