import { Handle, Position, NodeProps } from 'reactflow';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function UploadNode({ data }: NodeProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      if (data.onImageUpload) {
        data.onImageUpload(file);
      }
    }
  }, [data]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 15 * 1024 * 1024,
    multiple: false,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setPreview(null);
  };

  return (
    <div className="relative">
      <Card className="w-64 p-4 bg-white border-2 shadow-md hover-elevate" data-testid="node-upload">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Upload className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">Upload Image</div>
            <div className="text-xs text-muted-foreground">PNG, JPEG (max 15MB)</div>
          </div>
        </div>

        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'
            }`}
            data-testid="dropzone-upload"
          >
            <input {...getInputProps()} />
            <FileImage className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {isDragActive ? 'Drop image here' : 'Drag & drop or click'}
            </p>
          </div>
        ) : (
          <div className="relative">
            <img
              src={preview || ''}
              alt="Uploaded preview"
              className="w-full h-32 object-cover rounded-md border"
              data-testid="img-preview"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={removeFile}
              data-testid="button-remove"
            >
              <X className="w-3 h-3" />
            </Button>
            <div className="mt-2 text-xs text-muted-foreground truncate" data-testid="text-filename">
              {uploadedFile.name}
            </div>
          </div>
        )}
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-primary border-2 border-white"
        data-testid="handle-source"
      />
    </div>
  );
}
