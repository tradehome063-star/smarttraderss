// @ts-nocheck — vendored bot code with known upstream type gaps; see AGENTS.md
import React from 'react';
import { observer } from 'mobx-react-lite';
import { tabs_title } from '@/constants/load-modal';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
/* [AI] - Analytics event tracking removed - see migrate-docs/MONITORING_PACKAGES.md for re-implementation guide */
/* [/AI] */
import MobileFullPageModal from '../shared_ui/mobile-full-page-modal';
import Modal from '../shared_ui/modal';
import Tabs from '../shared_ui/tabs';
import GoogleDrive from './google-drive';
import Local from './local';
import LocalFooter from './local-footer';
import Recent from './recent';
import RecentFooter from './recent-footer';

// --- NEW FREE BOTS COMPONENT ---
const FreeBotsList = () => {
    // Add your file names and titles here. 
    // Make sure these XML files are uploaded into your public/xml/ folder!
    const bots = [
        { name: 'Martingale Bot', file: '/xml/martingale.xml', desc: 'Classic multiplier strategy.' },
        { name: 'Trend Follower', file: '/xml/trend_follower.xml', desc: 'Follows major market movements.' },
    ];

    return (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Available Free Strategies:</h4>
            {bots.map((bot, index) => (
                <div key={index} style={{ border: '1px solid #eee', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                    <div>
                        <strong style={{ display: 'block', color: '#333' }}>{bot.name}</strong>
                        <small style={{ color: '#666' }}>{bot.desc}</small>
                    </div>
                    <a href={bot.file} download style={{ background: '#ff444f', color: '#fff', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                        Download XML
                    </a>
                </div>
            ))}
        </div>
    );
};

const LoadModal: React.FC = observer(() => {
    const { load_modal, dashboard, google_drive } = useStore();
    const { is_google_drive_configured } = google_drive;
    const {
        active_index,
        is_load_modal_open,
        loaded_local_file,
        onEntered,
        recent_strategies,
        setActiveTabIndex,
        toggleLoadModal,
        tab_name,
    } = load_modal;
    const { setPreviewOnPopup } = dashboard;
    const { isDesktop } = useDevice();
    const header_text = localize('Load strategy');

    const handleTabItemClick = (active_index: number) => {
        setActiveTabIndex(active_index);
        /* [AI] - Analytics event tracking removed - see migrate-docs/MONITORING_PACKAGES.md for re-implementation guide */
        /* [/AI] */
    };

    if (!isDesktop) {
        return (
            <MobileFullPageModal
                is_modal_open={is_load_modal_open}
                className='load-strategy__wrapper'
                header={header_text}
                onClickClose={() => {
                    setPreviewOnPopup(false);
                    toggleLoadModal();
                }}
                height_offset='80px'
                page_overlay
            >
                <Tabs active_index={active_index} onTabItemClick={handleTabItemClick} top>
                    <div label={localize('Local')}>
                        <Local />
                    </div>
                    <div label={localize('Free Bots')}>
                        <FreeBotsList />
                    </div>
                    {is_google_drive_configured && (
                        <div label='Google Drive'>
                            <GoogleDrive />
                        </div>
                    )}
                </Tabs>
            </MobileFullPageModal>
        );
    }

    const is_file_loaded = !!loaded_local_file && tab_name === tabs_title.TAB_LOCAL;
    const has_recent_strategies = recent_strategies.length > 0 && tab_name === tabs_title.TAB_RECENT;

    return (
        <Modal
            title={header_text}
            className='load-strategy'
            width='1000px'
            height='80vh'
            is_open={is_load_modal_open}
            toggleModal={() => {
                toggleLoadModal();
            }}
            onEntered={onEntered}
            elements_to_ignore={[document.querySelector('.injectionDiv')]}
        >
            <Modal.Body>
                <Tabs active_index={active_index} onTabItemClick={handleTabItemClick} top header_fit_content>
                    <div label={localize('Recent')}>
                        <Recent />
                    </div>
                    <div label={localize('Local')}>
                        <Local />
                    </div>
                    <div label={localize('Free Bots')}>
                        <FreeBotsList />
                    </div>
                    {is_google_drive_configured && (
                        <div label='Google Drive'>
                            <GoogleDrive />
                        </div>
                    )}
                </Tabs>
            </Modal.Body>
            {has_recent_strategies && (
                <Modal.Footer has_separator>
                    <RecentFooter />
                </Modal.Footer>
            )}
            {is_file_loaded && (
                <Modal.Footer has_separator>
                    <LocalFooter />
                </Modal.Footer>
            )}
        </Modal>
    );
});

export default LoadModal;
        
