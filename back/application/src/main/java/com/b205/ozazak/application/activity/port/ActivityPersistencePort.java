package com.b205.ozazak.application.activity.port;

import com.b205.ozazak.domain.activity.entity.Activity;
import java.util.Optional;
import java.util.List;

public interface ActivityPersistencePort {
    Activity save(Activity activity);
    Optional<Activity> findById(Long activityId);
    List<Activity> findByAccountIdAndCode(Long accountId, Integer code);
    void deleteById(Long activityId);
}
