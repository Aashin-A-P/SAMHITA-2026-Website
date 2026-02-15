import React, { useEffect, useRef, useState } from 'react';
import Loader from '../components/Loader';
import ThemedModal from '../components/ThemedModal';
import API_BASE_URL from '../Config';

interface Pass {
  id: number;
  name: string;
  cost: number;
  pass_limit: number;
  description: string;
  posterImage?: string | null;
}

const AdminPassesDisplayPage: React.FC = () => {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [showMenuForPassId, setShowMenuForPassId] = useState<number | null>(null);
  const [selectedPassForPoster, setSelectedPassForPoster] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

  const showModal = (title: string, message: string) => {
    setModal({ isOpen: true, title, message });
  };

  const fetchPasses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/passes`);
      const data = await response.json();
      setPasses(Array.isArray(data) ? data : []);
    } catch (err) {
      showModal('Error', 'Error fetching passes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleAddPosterClick = (passId: number) => {
    setSelectedPassForPoster(passId);
    setShowMenuForPassId(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && selectedPassForPoster) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('posterImage', file);

      try {
        const response = await fetch(`${API_BASE_URL}/passes/${selectedPassForPoster}/poster`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          showModal('Success', 'Poster uploaded successfully!');
          fetchPasses();
        } else {
          showModal('Error', 'Failed to upload poster.');
        }
      } catch (error) {
        showModal('Error', 'Error uploading poster.');
      }
      setSelectedPassForPoster(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePoster = async (passId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/passes/${passId}/poster`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showModal('Success', 'Poster removed successfully!');
        fetchPasses();
      } else {
        showModal('Error', 'Failed to remove poster.');
      }
    } catch (error) {
      showModal('Error', 'Error removing poster.');
    }
    setShowMenuForPassId(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ThemedModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, title: '', message: '' })}
        title={modal.title}
        message={modal.message}
      />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="container mx-auto p-4 pt-20">
          <h1 className="text-3xl font-bold text-gold-gradient mb-6 text-center">All Passes</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passes.map(pass => (
              <div key={pass.id} className="relative bg-gray-900/70 p-5 rounded-lg border border-gray-700 shadow-lg">
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => setShowMenuForPassId(showMenuForPassId === pass.id ? null : pass.id)}
                    className="text-gray-400 hover:text-white focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </button>
                  {showMenuForPassId === pass.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                      <button
                        onClick={() => handleAddPosterClick(pass.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Add Poster
                      </button>
                      <button
                        onClick={() => handleRemovePoster(pass.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Remove Poster
                      </button>
                    </div>
                  )}
                </div>

                {pass.posterImage && (
                  <div className="mb-4">
                    <img
                      src={`data:image/jpeg;base64,${pass.posterImage}`}
                      alt="Pass Poster"
                      className="w-full h-auto object-contain rounded-md"
                    />
                  </div>
                )}

                <h4 className="text-xl font-bold text-white mb-2">{pass.name}</h4>
                <p className="text-gray-300 text-sm mb-3">{pass.description}</p>
                <div className="text-gray-400 text-xs space-y-1">
                  <p><strong>Cost:</strong> {'\u20B9'}{pass.cost}</p>
                  <p><strong>Limit:</strong> {pass.pass_limit}</p>
                </div>
              </div>
            ))}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>
      )}
    </div>
  );
};

export default AdminPassesDisplayPage;
