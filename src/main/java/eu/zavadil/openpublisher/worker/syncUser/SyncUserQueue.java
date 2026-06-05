package eu.zavadil.openpublisher.worker.syncUser;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.openpublisher.data.user.User;
import eu.zavadil.openpublisher.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class SyncUserQueue extends PagedSmartQueue<User> {

	@Autowired
	UsersService usersService;

	@Override
	public Page<User> loadRemaining() {
		return this.usersService.loadSyncQueue();
	}

}
