package eu.zavadil.openpublisher.worker.syncUser;

import eu.zavadil.java.queues.SmartQueueProcessorBase;
import eu.zavadil.openpublisher.data.user.User;
import eu.zavadil.openpublisher.service.OAuthSyncService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SyncUserWorker extends SmartQueueProcessorBase<User> {

	@Autowired
	OAuthSyncService oAuthSyncService;

	@Autowired
	public SyncUserWorker(SyncUserQueue queue) {
		super(queue);
	}

	@Override
	public void processItem(User u) {
		try {
			log.info("syncing user {}", u.getEmail());
			this.oAuthSyncService.syncUser(u);
		} catch (Exception e) {
			log.error("User sync failed: {}", u, e);
		}
	}
}
